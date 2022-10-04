import { Link } from 'react-router-dom'
import hotCategoryImage from '../assets/jpg/hotCategoryImage.webp'
import suggestedCategoryImage from '../assets/jpg/suggestedCategoryImage.png'
import outfitCategoryImage from '../assets/jpg/closet.jpeg'
import inspirationCategoryImage from '../assets/jpg/inspirationCategoryImage.png'

function Explore () {
return (
  <div className='explore'>
    <header>
      <p className='pageHeader'>Explore</p>
    </header>

    <main>
      <p className='exploreCategoryHeading'>Categories</p>
      <div className='exploreCategories'>
        <Link to='/category/original' style={{textDecoration: 'none'}}>
          <img
            src={outfitCategoryImage}
            alt='original'
            className='exploreCategoryImg'
          />
          <p className='exploreCategoryName'> Outfits</p>
        </Link>
        <Link to='/category/inspiration' style={{textDecoration: 'none'}}>
          <img
            src={inspirationCategoryImage}
            alt='inspiration'
            className='exploreCategoryImg'
          />
          <p className='exploreCategoryName'>Inspiration</p>
        </Link>
        </div>
        <div className='exploreCategories'>
        <Link to='/category/suggested' style={{textDecoration: 'none'}}>
          <img
            src={suggestedCategoryImage}
            alt='sell'
            className='exploreCategoryImg'
          />
          <p className='exploreCategoryName'>Suggested For You</p>
        </Link>
        <Link to='/category/hot' style={{textDecoration: 'none'}}>
          <img
            src={hotCategoryImage}
            alt='rent'
            className='exploreCategoryImg'
          />
          <p className='exploreCategoryName'>Hot Right Now</p>
        </Link>
      </div>
    </main>
  </div>
)
}

export default Explore