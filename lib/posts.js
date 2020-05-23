import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fullContents = fs.readFileSync(fullPath, 'utf-8')
  const matterResult = matter(fullContents)
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  console.log(contentHtml)

  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostData = fileNames.map((fileName) => {
    // remove '.md' in file name
    const id = fileName.replace(/\.md$/, '')
    //read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf-8')

    // use gray matter to parse to post metadata section
    const matterResult = matter(fileContents)

    //combine the data with the id
    return {
      id,
      ...matterResult.data,
    }
  })
  // sort post by date
  return allPostData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}
