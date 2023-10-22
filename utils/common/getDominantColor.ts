export const getDominantColor = (imageSrc: string, callback: (dominantColor: string) => void) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous'; // Enable cross-origin access for the image

  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      const colorCounts: { [key: string]: number } = {};

      // Calculate the frequency of each color in the image
      for (let i = 0; i < imageData.length; i += 4) {
        const color = `rgba(${imageData[i]}, ${imageData[i + 1]}, ${imageData[i + 2]}, ${imageData[i + 3]})`;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }

      // Sort the colors by frequency in descending order
      const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

      // Filter out colors that are too dark or too bright
      const filteredColors = sortedColors.filter(([color, _]) => {
        const rgb = color.match(/\d+/g);
        if (rgb) {
          const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
          return brightness > 50 && brightness < 200; // Adjust the brightness range as needed
        }
        return false;
      });

      // Select the color used most frequently among the filtered colors
      const selectedColor = filteredColors.length > 0 ? filteredColors[0][0] : 'No valid color found';

      // Call the callback with the selected color
      callback(selectedColor);
    } else {
      console.error('Canvas context is null.');
    }
  };

  img.src = imageSrc;
};
