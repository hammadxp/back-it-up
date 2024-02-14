export function getTimestamp() {
	const timestamp = new Date();

	const year = String(timestamp.getFullYear()).padStart(4, "0");
	const month = String(timestamp.getMonth() + 1).padStart(2, "0");
	const day = String(timestamp.getDate()).padStart(2, "0");
	const hours = String(timestamp.getHours()).padStart(2, "0");
	const minutes = String(timestamp.getMinutes()).padStart(2, "0");
	const seconds = String(timestamp.getSeconds()).padStart(2, "0");

	const formattedTimestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`;

	return formattedTimestamp;
}
