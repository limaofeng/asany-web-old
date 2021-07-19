// formatData
function padDate(value) {
  return value < 10 ? "0" + value : value;
}

const formatDate = value => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  const year = date.getFullYear();
  const month = padDate(date.getMonth() + 1);
  const day = padDate(date.getDate());
  const hours = padDate(date.getHours());
  const minutes = padDate(date.getMinutes());
  const seconds = padDate(date.getSeconds());
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
};

export default formatDate;
