#!/usr/bin/env node
import path from "path"
import fs from "fs"

const argv = process.argv[2].toLocaleLowerCase();

if (argv > "" && /^[a-zA-Z]+$/.test(argv)) {

const capArgv = argv.charAt(0).toUpperCase() + argv.slice(1);

const crudArr = ["get", "post", "put", "patch", "delete"];

fs.promises.mkdir(path.join(process.cwd(), 'src', 'api', argv));

let indexRes:string;
let lastImport: number;
let lastRoute: number;


fs.readFile(path.join(process.cwd(), 'src', 'api', "index.ts"), function(err: NodeJS.ErrnoException | null, data: object) {
  if(err) throw err;
 
  const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

  arr.forEach((elem: string, index: number) => {
    if(elem.includes("import")) {
      lastImport = index
    }
  })

  arr.splice(lastImport + 1, 0, `import ${argv + "Router"} from './${argv}';`);

  for(let i = 0; i < arr.length; i++) {
    if(arr[i].includes("registerRouters")) {
      lastRoute = 1
    } else if (lastRoute === 1 && arr[i].includes("}")){
      lastRoute = i;
      i = arr.length
    }
  }

  if(lastRoute > 0) {
  arr.splice(lastRoute, 0, `app.use('/${argv}s', ${argv}Router);`);
  }

  indexRes = arr.reduce((prev, curr) => {
    return prev + "\n" + curr
  })

  if(indexRes.includes(argv)) {
    fs.promises.writeFile(path.join(process.cwd(), 'src', 'api', "index.ts"), indexRes)
  }
});



crudArr.forEach((elem) => {
    fs.promises.writeFile(path.join(process.cwd(), 'src', 'api', argv, elem + ".ts"),
    `import { Request, Response } from 'express';

    export const ${elem + capArgv} = async (req: Request, res: Response) => {
      res.sendStatus(200);
    };
    `
    );
})

fs.promises.writeFile(path.join(process.cwd(), 'src', 'api', argv, "index.ts"),
`import { Router } from 'express';
import { get${capArgv} } from './get';
import { post${capArgv} } from './post';
import { patch${capArgv} } from './patch';
import { delete${capArgv} } from './delete';
import { put${capArgv} } from './put';

const router = Router();

router.get('/', get${capArgv});
router.post('/', post${capArgv});
router.patch('/', patch${capArgv});
router.delete('/', delete${capArgv});
router.put('/', put${capArgv});

export default router;
`
);


} else {
  console.log(
    `ERROR
    Argument is empty or argument should contain only letters`)
}

