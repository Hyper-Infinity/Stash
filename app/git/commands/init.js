const fs = require('fs');

class Init {
    constructor() {

    }
    execute() {
        fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
        fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), {
            recursive: true,
        });
        fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

        fs.writeFileSync(
            path.join(process.cwd(), ".git", "HEAD"),
            "ref: refs/heads/main\n"
        );
        console.log("Initialized git directory");
    }
}

module.exports = Init;