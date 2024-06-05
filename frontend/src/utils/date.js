export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year:'numeric',
        month:'numeric',
        day:'numeric', 
        hour: 'numeric', 
        minute:'numeric',
        hour12: true 
    }).replaceAll(',', ' |')
}