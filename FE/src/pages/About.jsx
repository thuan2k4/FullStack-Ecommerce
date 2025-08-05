import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from './../components/NewsletterBox';


const About = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore et eos error harum nihil obcaecati sunt ut officia? Vel reprehenderit consequuntur est minus blanditiis unde cum incidunt quidem quae pariatur?</p>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores facilis doloremque aspernatur consectetur omnis, ex, quisquam obcaecati hic quam ipsa adipisci cum est, tempore placeat. Neque doloribus eum impedit earum.</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad modi nisi quod, nemo odio accusantium veniam ratione, natus facilis corporis quos molestiae tenetur! Voluptatibus labore obcaecati accusantium? Ratione, voluptatibus voluptatum!</p>
                </div>
            </div>

            <div className='text-xl py-4 '>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>

            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quanlity Assurance:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. A blanditiis delectus quos sint, nesciunt laboriosam quasi tempore dolorem voluptates quidem laborum? Quisquam mollitia autem eligendi ut eum totam iusto exercitationem.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Convenience:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. A blanditiis delectus quos sint, nesciunt laboriosam quasi tempore dolorem voluptates quidem laborum? Quisquam mollitia autem eligendi ut eum totam iusto exercitationem.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Exceptional Customer Service:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. A blanditiis delectus quos sint, nesciunt laboriosam quasi tempore dolorem voluptates quidem laborum? Quisquam mollitia autem eligendi ut eum totam iusto exercitationem.</p>
                </div>
            </div>
            <NewsletterBox />
        </div>
    )
}

export default About
