
import SiteDescription from "./SiteDesc";

import React, { useState, useEffect, useRef } from "react";
import HoverVideo from "./HoverVideo";


  const PAGE_SIZE = 10;
  
  function PageAll() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
  
    useEffect(() => {
      async function fetchCourses() {
        setIsLoading(true);
  
        try {
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGQyNDI5NC0xMTFiLTQ3Y2ItOWE0ZS1iOGM0MWVkNDFhM2EiLCJwbGF0Zm9ybSI6InN1YnNjcmlwdGlvbnMiLCJpYXQiOjE2NzkwNTYzNjMsImV4cCI6MTY3OTk1NjM2M30.9CieMFG5NXyeIXQLVbwzWFM51yikKE6e-p55Gmyqt20";
          const response = await fetch(
            'https://api.wisey.app/api/v1/core/preview-courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
           
          const rev = data.courses.reverse()
          setCourses(rev);
             
          // setCourses(data.courses);
          
          console.log(data.courses)
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          setError(err);
        }
      }
  
      fetchCourses();
    }, []);
  
    const onPageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const indexOfLastCourse = currentPage * PAGE_SIZE;
    const indexOfFirstCourse = indexOfLastCourse - PAGE_SIZE;
    // const coursesCopy = courses.slice();
    // const CourseReverse = coursesCopy.reverse();
  
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(courses.length / PAGE_SIZE);
    console.log(currentCourses)

   

    function ScrollToTopButton() {
      const [isVisible, setIsVisible] = useState(false);
    
      useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);
    
      function handleScroll() {
        if (window.pageYOffset > 20) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    
      function handleClick() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    
      return (
        <button
          id="scroll-to-top-btn"
          onClick={handleClick}
          style={{ display: isVisible ? 'block' : 'none' }}
        >
          Scroll to top
        </button>
      );
    }
   


    return (
      <>
          <SiteDescription/>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!isLoading && !error && (
          <>
            <ul className="all-courses-list">
              {currentCourses.map((item, index) => (
                <li key={item.id} style={{ alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                    
                    <div className="course-container" key={item.title + " container"}>

                        <div className="video-block">
                        

                        {item && item.meta.courseVideoPreview && item.meta.courseVideoPreview.link ? (
    <HoverVideo src={item.meta.courseVideoPreview.link} poster={item.previewImageLink + "/cover.webp"} />
  ) : null}

                        </div>



                        <a href={"/"+item.title.replace(/-/ig, '_').replace(/:/ig, '--').replace(/ /ig, '-')}  className="red about-course">About course</a>
                        <h3 className="course-title-h3">{item.title} </h3>
                      
                        

                      <div className="course-row1" key={item.title + " row1"}>
                        <p className="course-statys" key={item.status}>Status: {item.status}</p>
                        <p className="course-rating" key = {item.rating}>Rating: {item.rating}</p>
                        <p className="course-lessonsCount" key={item.lessonsCount}>Lessons count: {item.lessonsCount}</p>
                        
                      </div>
                      <div className="course-row2" key={item.title + " row2"}>
    
                          <p className="course-skills" key = {item.meta.skills}>Skills: {
                          item.meta.skills?
                          item.meta.skills.join(". "): null}</p>
                      </div>

                      {/* <div className="video-container" key = {item.meta.courseVideoPreview}></div> */}
  
      </div>  
                </li>
              ))}
            </ul>
            
   






            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        pageNumber === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => onPageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </>
        )}
      </>
    );
  }
  
  export default PageAll;




   