export async function getGenres(params = {}) {
  try {
    const response = await fetch("/data/books.json");
    let data = await response.json();
    data = data.map((item) => {
      return {name: item.genre};
    });
    return { data: data };
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}
