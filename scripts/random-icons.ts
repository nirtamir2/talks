const take = ["carbon", "ri", "ph", "tabler", "catppuccin"];

const icons = (
  await Promise.all(
    take.map(async (name) => {
      // eslint-disable-next-line github/no-then
      const collection = await import(`@iconify/json/json/${name}.json`).then(
        (r) => r.default,
      );
      const list = Object.keys(collection.icons)
        .map((i) => `i-${name}:${i}`)
        .filter(
          (i) =>
            !/-(?:bold|fill|outline|light|thin)$/.test(i) &&
            !/brand|logo|folder/.test(i),
        );

      shuffle(list);
      return list.slice(0, 100);
    }),
  )
// eslint-disable-next-line unicorn/no-await-expression-member
).flat();

function shuffle(array: Array<unknown>) {
  for (let i = array.length - 1; i > 0; i--) {
    // eslint-disable-next-line sonarjs/pseudo-random
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(icons);

console.log(icons.slice(0, 100));
export { };

