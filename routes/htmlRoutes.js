const path = require('path');

module.exports = app =>{

    app.get('/notes',(req, res) =>{
        res.sendfile(path.join(__dirname, '../public/notes'));
    })

    app.get('*',(req, res) =>{
        res.sendfile(path.join(__dirname, '../public/index.html'))
    })
}