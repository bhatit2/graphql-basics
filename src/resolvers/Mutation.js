import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, { db }, info) {
        let emailTaken = db.users.some(user => user.email === args.data.email);
        if (emailTaken) {
            throw new Error('email taken!');
        }
        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user);
        return user;
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.users.find((user) => user.id === id);
        if (!user) {
            throw new Error("User not found");
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.find((user) => user.email === data.email);
            if (emailTaken) {
                throw new Error("Email in use")
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== undefined) {
            user.age = data.age
        }

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        let userIndex = db.users.findIndex(user => user.id === args.id);

        if (userIndex === -1) {
            throw new Error("user doesn't exist");
        }

        let deletedUser = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            let match = post.author !== args.id;
            if (match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id);
            }
            return !match
        });
        db.comments = db.comments.filter((comment) => comment.author !== args.id);

        return deletedUser[0];
    },
    createPost(parent, args, { db, pubsub }, info) {
        let userExists = db.users.some(user => user.id === args.data.author);
        if (!userExists) {
            throw new Error("User doesn't exist");
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post);
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    data: post,
                    mutation: 'CREATED'
                }
            });
        }

        return post;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const post = db.posts.find((post) => post.id === id);
        let originalPost = { ...data };

        if (!post) {
            throw new Error("post not found");
        }
        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published !== undefined) {
            post.published = data.published;
            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: "DELETED",
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                })
            }
        } else if(post.published) {
            pubsub.publish('post', {
                post : {
                    mutation : 'UPDATED',
                    data : post
                }
            })
        }

        return post;

    },
    deletePost(parent, args, { db, pubsub }, info) {
        let postIndex = db.posts.findIndex(post => post.id === args.id);
        if (postIndex === -1) {
            throw new Error("Post not found")
        }

        let [post] = db.posts.splice(postIndex, 1);
        let comments = db.comments.filter(comment => comment.post !== args.id);
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post;
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some(user => user.id === args.data.author);
        const postExists = db.posts.some(post => post.id === args.data.post && db.posts.published);

        if (!userExists || postExists) {
            throw new Error("user doesn't exist");
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`, { 
            comment : {
                mutation : 'CREATED',
                data : comment
            } 
        });
        return comment;
    },
    updateComment(parent, args, { db, pubsub}, info) {
        const { id, data } = args;
        const comment = db.comments.find((comment) => comment.id === id);
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (typeof data.text === "string") {
            comment.text = data.text
        }

        pubsub.publish(`comment ${id}`, { 
            comment : {
                mutation : 'UPDATED',
                data : comment
            } 
        });
        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        let commentIndex = db.comments.findIndex((comment) => comment.id === args.id);
        if (commentIndex === -1) {
            throw new Error("Comment not found");
        }

        let deletedComment = db.comments.splice(commentIndex, 1);
        pubsub.publish(`comment ${args.id}`, { 
            comment : {
                mutation : 'DELETED',
                data : deletedComment[0]
            } 
        });
        return deletedComment[0];
    }

}

export default Mutation