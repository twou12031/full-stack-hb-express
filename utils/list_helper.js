const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.map(blog => {
        return blog.likes
    }).reduce((sum, item) => {
        return sum + item
    })
}

const favoriteBlog = (blogs) => {
    let res
    let maxLikes = 0
    blogs.forEach(blog => {
        const { likes } = blog
        if (likes > maxLikes) {
            maxLikes = likes
            res = blog
        }
    })
    if (!res) {
        return {}
    }
    const { title, author, likes } = res
    return { title, author, likes }
}

const mostBlogs = (blogsArr) => {
    const formatArr = []
    blogsArr.forEach(blog => {
        const objWithAuthor = formatArr.find(item => {
            return item.author === blog.author
        })

        if (!objWithAuthor) {
            formatArr.push({
                author: blog.author,
                blogs: 1
            })
        } else {
            objWithAuthor.blogs += 1
        }
    })

    let res
    let maxBlogs = 0
    formatArr.forEach(item => {
        const { blogs } = item
        if (blogs > maxBlogs) {
            maxBlogs = blogs
            res = item
        }
    })

    if (!res) {
        return {}
    }
    const { author, blogs } = res
    return { author, blogs }
}

const mostlike = (blogsArr) => {
    const resObj = {}
    blogsArr.forEach(blog => {
        const { author, likes } = blog
        if (resObj[author]) {
            resObj[author] += likes
        } else {
            resObj[author] = likes
        }
    })


    let resAuthor
    let maxLikes = 0

    for (const author in resObj) {
        const likes = resObj[author]
        if (likes > maxLikes) {
            maxLikes = likes
            resAuthor = author
        }
    }

    if (!resAuthor) {
        return {}
    }
    return { author: resAuthor, likes: maxLikes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostlike
}
