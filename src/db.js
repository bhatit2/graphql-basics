let users = [
    {
        id: '1',
        name: 'Tanvi',
        email: 'tanvi@example.com'
    },
    {
        id: '2',
        name: 'Garima',
        email: 'garima@example.com'
    },
    {
        id: '3',
        name: 'Rahul',
        email: 'rahul@example.com'
    }
]
let posts = [
    {
        id: '1',
        title: 'Post1',
        body: 'lorem ipsum lorem ipsum',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Hair care',
        body: 'how to take crae of your hair etc, etc',
        published: false,
        author: '2'
    },
    {
        id: '3',
        title: 'Skin care',
        body: 'how to take crae of your skin etc, etc',
        published: true,
        author: '2'
    }
]
let comments = [
    {
        id: '1',
        text: 'abc',
        author: '2',
        post: '1'
    },
    {
        id: '2',
        text: 'xyz',
        author: '1',
        post: '1'
    },
    {
        id: '3',
        text: 'njknojbj',
        author: '2',
        post: '2'
    },
    {
        id: '4',
        text: ',kpohugyuvjkh',
        author: '3',
        post: '3'
    }
]

const db = {
    users,
    posts,
    comments
}

export { db as default}