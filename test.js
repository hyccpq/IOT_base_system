

let arr = [{
    tag: 233
},{
    tag: 556
},{
    tag: 233
}],
tagId

arr.forEach(item => {
    if(tagId.indexOf(item) === -1) {
        tagId.push(item);
    } 
})
console.log(tagId);

