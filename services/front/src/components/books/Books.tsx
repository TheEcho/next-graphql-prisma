'use client'

import { useState } from 'react'

import { useCreateBookMutation, useGetBooksQuery } from '@src/generated/api-graphql'
import { useGeneratedMutation, useGeneratedQueryWithError } from '@src/lib/apollo/hooks'

export const Books = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const { data } = useGeneratedQueryWithError(useGetBooksQuery())

  const [createBook] = useGeneratedMutation(useCreateBookMutation(), {})

  const handleAddBook = async () => {
    await createBook({
      variables: {
        input: {
          title,
          content,
          published: isPublished,
          authorId: '',
        },
      },
      refetchQueries: ['getBooks'],
    })
  }

  return (
    <>
      {data?.books.books.map(book => <div key={book.title}>{book.title}</div>)}
      <div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
        <input
          type="checkbox"
          checked={isPublished}
          onChange={e => setIsPublished(e.target.checked)}
          placeholder="Name"
        />
        <button onClick={() => handleAddBook}>Add</button>
      </div>
    </>
  )
}
