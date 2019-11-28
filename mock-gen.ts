import * as faker from 'faker';
import { writeFileSync } from 'fs';

function buildItem(_, ix) {
  return {
    id: ix,
    name: faker.commerce.productName(),
    category: new Array(3)
      .fill(1)
      .map(() => faker.helpers.randomize(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'])),
    inStock: faker.random.boolean(),
  };
}

let result = `export default ${JSON.stringify(new Array(10000).fill(1).map(buildItem))}`;

writeFileSync('products.ts', result);
