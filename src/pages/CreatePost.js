import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Spinner from '../components/Spinner'

function CreatePost() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'original',
    name: '',
    caption: '',
    images: {},
  })

  const {
    type,
    name,
    caption,
    images,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log(formData)
    setLoading(true)

    

    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images')
      return
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    }

    delete formDataCopy.images
    caption && (formDataCopy.caption = caption)

    const docRef = await addDoc(collection(db, 'posts'), formDataCopy)
    setLoading(false)
    toast.success('Post saved!')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }
  


  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create a Post</p>
      </header>

      <main>
        <form className="pageContainer2"onSubmit={submitHandler}>
          <label className='formLabel'>Original / Inspiration</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'original' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='original'
              onClick={onMutate}
            >
              Original Post
            </button>
            <button
              type='button'
              className={type === 'inspiration' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='inspiration'
              onClick={onMutate}
            >
              Inspiration Post
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='1'
            required
          />
          <label className='formLabel'>Caption</label>
          <textarea
            className='formInputCaption'
            type='text'
            id='caption'
            value={caption}
            onChange={onMutate}
            required
          />

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg,.webp'
            multiple
            required
          />
          <button type='submit' className='primaryButton createPostButton'>
            Create Post
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreatePost
