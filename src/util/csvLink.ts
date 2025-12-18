export function csvLinkDownload(data:Blob, filename: string){
     const blob = window.URL.createObjectURL(data)
        const link = document.createElement('a')
        link.style ='none'
        link.href = blob
        const date = new Date(Date.now()).toDateString()
        link.setAttribute('download', `${filename}_${date.toLowerCase().split(" ").join("_")}.csv`)
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(blob)
}