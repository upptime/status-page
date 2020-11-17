import { copyFile } from "fs-extra";
import { join } from "path";

const initTests = async () => {
  await copyFile(join(".", ".upptimerc.yml"), join("..", ".upptimerc.yml"));
};
initTests();
