const Query = {
    me() {
        return {
            id: '123456',
            name: 'Tanvi',
            email: 'tbhatia@gmail.com'
        }
    },
    post() {
        return {
            id: '123we',
            title: 'property analysis',
            body: 'here is list of prominent projects around Hyderabad and other info',
            published: true
        }
    },
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }
        return db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter((post) => {
            return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    }
}

export default Query