#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const argv = process.argv[2]

const capArgv = argv.charAt(0).toUpperCase() + argv.slice(1);

const crudArr = ["get", "post", "put", "patch", "delete"];

fs.promises.mkdir(path.join(process.cwd(), 'src', 'api', argv));

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


