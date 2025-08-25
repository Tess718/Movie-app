import './Spinner.css'

const Spinner = () => {
  return ( 
<div className="loader z-90 relative">
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__ball"></div>
</div>
  )
}

export default Spinner