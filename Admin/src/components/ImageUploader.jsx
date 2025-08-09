import React from 'react'

import { assets } from '../assets/admin_assets/assets'

const ImageUploader = ({ images, setImages }) => {

    const handleImagesChange = async (e) => {
        const files = Array.from(e.target.files)

        if (files.length > 10) {
            alert("Bạn chỉ được upload tối đa 10 ảnh.")
            return
        }

        setImages(prev => [...prev, ...files])
    }

    return (
        <div>
            {
                images.length === 0
                    ? <div>
                        <label htmlFor="imageUpload" className="cursor-pointer">
                            <img src={assets.upload_area} className="w-40 h-40 object-cover border border-gray-300 rounded" />
                        </label>
                        <input
                            id="imageUpload"
                            type="file"
                            multiple
                            hidden
                            onChange={handleImagesChange}
                        />
                    </div>
                    : <div className='grid grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-5'>
                        {
                            images.map((image, index) => (
                                <label htmlFor="image">
                                    <img src={URL.createObjectURL(image)} key={index} className="w-full h-50 object-cover rounded border border-gray-300" />
                                </label>
                            ))
                        }
                    </div>
            }
        </div>
    )
}

export default ImageUploader
