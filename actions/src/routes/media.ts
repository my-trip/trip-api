import e, { Router, Response } from 'express'

import moment from 'moment'

import AWS from 'aws-sdk'

import { HasuraService } from '../remotes/hasura'

import URL from 'url-parse'

import { INSERT_MEDIA, MEDIA, FINISH_MEDIA } from '../remotes/hasura/graphql/'

import { v4 as uuidv4 } from 'uuid';

const { ASSETS_BUCKET: Bucket } = process.env

const s3 = new AWS.S3()
const router = Router()

const acl = {
  default: 'public-read'
}

const types = [
  'tour-cover',
]

router.post('/media/init', async (req, res) => {
  const headers = req.body.session_variables
  const body = req.body.input.input
  const userId = headers['x-hasura-user-id']

  const { record_id, type, mimetype } = body

  if (!types.includes(type)) {
    return res.status(401).json({ code: "401", message: 'Media type not allowed' })
  }

  try {
    const id = uuidv4()
    const Key = `media/${type}/${id}`
    const ACL = acl[type] || acl['default']

    const response = await s3.getSignedUrlPromise('putObject', { Bucket: 'my-trip', Key, ContentType: mimetype, ACL, Expires: 300 })

    const { data } = await HasuraService.mutate({
      mutation: INSERT_MEDIA,
      variables: {
        id,
        record_id,
        type,
        mimetype,
        user_id: userId,
        signed_url: response
      }
    })

    delete data.insert_media_one.__typename

    res.status(200).json(data.insert_media_one)
  } catch (e) {
    console.log(e)
    return res.status(400).json({ code: "404" })
  }
})


router.post('/media/finish', async (req, res) => {
  try {

    const headers = req.body.session_variables
    const body = req.body.input.input
    const userId = headers['x-hasura-user-id']

    const id = body.id

    const { data: { media_by_pk: { mimetype, type, record_id, signed_url, user: { id: user_id }, public_url } } } = await HasuraService.query({
      query: MEDIA,
      variables: {
        id
      }
    })

    // if we have public_url it means it has been finished already
    if (userId !== user_id || public_url) {
      return res.status(404).json({ code: "404", message: 'Media not found' })
    }

    const parts = new URL(signed_url)
    const Key = parts.pathname.replace(/^\//, '')

    const final_public_url = parts.href

    const filesize = await s3.headObject({ Key, Bucket: 'trip-api' })
      .promise()
      .then(res => res.ContentLength)


    const { data: { media } } = await HasuraService.mutate({
      mutation: FINISH_MEDIA,
      variables: {
        media_id: id,
        filesize,
        public_url: final_public_url
      }
    })

    delete media.__typename
    res.status(200).json(media)
  }
  catch (error) {
    return res.status(400).json({ code: "404" })
  }
})

export { router as MediaRouter }