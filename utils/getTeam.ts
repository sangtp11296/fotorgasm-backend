export const getTeams = async (teamName: string) => {
    const res = await fetch(`https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/team?teamName=${teamName}`, {
        method: "GET"
    })
    const getData = await res.json();
    return getData
};
export const getAuthor = async (author: string) => {
    const res = await fetch(`https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/author?authorName=${author}`, {
        method: "GET"
    })
    const getData = await res.json();
    return getData
}