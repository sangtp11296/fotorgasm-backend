 // Convert Date Post
 export function convertDatePost (date: string){
    const dateObj = new Date(date);
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are 0-indexed
    const year = dateObj.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
}