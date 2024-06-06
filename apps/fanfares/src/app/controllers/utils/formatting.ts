export function getIdFromUrl(pathname: string) {
    const split = pathname.split("/")
    return split[split.length - 1]
  }
  
  export function formatDate(date: Date): string {
    // Array of month abbreviations
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
  
    // Extracting day, month, and year from the date
    const day = date.getDate().toString().padStart(2, "0")
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString().substring(2)
  
    // Formatting the date
    return `${day} ${month}, ${year}`
  }
  

  export function formatPlayerTime(seconds: number){
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;

    // Format each time component to add leading zeros if needed
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = sec.toString().padStart(2, "0");

    // Return the formatted time
    // If hours are 0, return only minutes and seconds
    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  };