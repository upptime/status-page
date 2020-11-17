import { copyFile, readFile } from "fs-extra";
import { join } from "path";

const initTests = async () => {
  let hasFile = false;
  try {
    await readFile(join("..", ".upptimerc.yml"));
    hasFile = true;
  } catch (error) {}
  if (!hasFile) await copyFile(join(".", ".upptimerc.yml"), join("..", ".upptimerc.yml"));
};
initTests();
