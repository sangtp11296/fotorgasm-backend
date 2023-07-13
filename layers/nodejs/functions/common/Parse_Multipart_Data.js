import fs from 'fs';

const getValueIgnoringKeyCase = (object, key) => {
  const foundKey = Object.keys(object).find(
    (currentKey) => currentKey.toLowerCase() === key.toLowerCase()
  );
  return object[foundKey];
};

const getBoundary = (event) => {
  return getValueIgnoringKeyCase(event.headers, 'Content-Type').split('=')[1];
};

const getFilePath = (event, fileName) => {
  return `/tmp/${Date.now()}-${fileName}`;
};

const saveFile = (buffer, filePath) => {
  fs.writeFileSync(filePath, buffer);
};

const multiPartParser = (event) => {
  const boundary = getBoundary(event);
  const result = {};
  console.log(event.body)
  console.log(event.body.split(boundary))
  event.body.split(boundary).forEach((item) => {
    if (/filename=".+"/g.test(item)) {
      const fileContents = item.slice(
        item.search(/Content-Type:\s.+/g) +
          item.match(/Content-Type:\s.+/g)[0].length +
          4,
        -4
      );
      const fileBuffer = Buffer.from(fileContents, 'binary');

      const fileName = item.match(/filename=".+"/g)[0].slice(10, -1);
      const filePath = getFilePath(event, fileName);
      saveFile(fileBuffer, filePath);

      result[item.match(/name=".+";/g)[0].slice(6, -2)] = {
        filename: fileName,
        contentType: item.match(/Content-Type:\s.+/g)[0].slice(14),
        path: filePath,
      };
    } else if (/name=".+"/g.test(item)) {
      result[item.match(/name=".+"/g)[0].slice(6, -1)] = item.slice(
        item.search(/name=".+"/g) +
          item.match(/name=".+"/g)[0].length +
          4,
        -4
      );
    }
  });
  return result;
};

export const parse = (event) => {
  let clonedEvent = { ...event };

  if (event.isBase64Encoded) {
    const body = clonedEvent.body;
    const decodedFromBase64 = Buffer.from(body, 'base64');
    clonedEvent.body = decodedFromBase64.toString('latin1');
  }

  const result = multiPartParser(clonedEvent);
  return result;
};
