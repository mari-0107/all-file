import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Hls from 'hls.js';

const Current = (props) => {

  const { title } = useParams();
  const titleClear = title.replace(/--/ig, ':').replace(/-/ig, ' ').replace(/_/ig, '-');
  const [courseData, setCourseData] = useState(null);
  const token = props.data;

  const [currentLesson, setCurrentLesson] = useState(null);

const [viewedLessons, setViewedLessons] = useState([]);
const [playbackRate, setPlaybackRate] = useState(1.0);
const [isPIP, setIsPIP] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch('https://api.wisey.app/api/v1/core/preview-courses', {
          headers: {Authorization: `Bearer ${token}`}
        });
        const courses = await response.json();
        console.log(courses)
        const course = courses.courses.find(course => course.title == titleClear);

        if (course) {
          const courseId = course.id;
          const courseResponse = await fetch(`https://api.wisey.app/api/v1/core/preview-courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}`}});
          const courseResult = await courseResponse.json();
          setCourseData(courseResult);

        } else {
          console.log(`Course with title ${titleClear} not found`);
          return (`Course with title ${titleClear} not found`)}
      } catch (error) {console.error(error);}
    };

    fetchCourseData();}, [titleClear]);
  console.log(courseData)


  useEffect(() => {
  

    if (currentLesson && currentLesson.link) {
      const video = document.getElementById('lesson-video');
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentLesson.link);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentLesson.link;
      } 
      if (!currentLesson.status === 'blocked') {
        video.playbackRate = playbackRate ;
      } 
}
  }, [currentLesson, playbackRate]);

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    lesson.viewed =true

    if (!viewedLessons.includes(lesson.id)) {
        setViewedLessons([...viewedLessons, lesson.id]);
      }
  };

  const handlePlaybackRateChange = (event) => { 
    const { value } = event.target;
    setPlaybackRate(parseFloat(value));
  }
  const handlePIP = () => {
    const video = document.getElementById('lesson-video');
    if (video !== document.pictureInPictureElement && !isPIP) {
      video.requestPictureInPicture();
      setIsPIP(true);
    } else {
      document.exitPictureInPicture();
      setIsPIP(false);
    }
}
const handleVideoEvent = (event) => {
    if (event.type === "leavepictureinpicture") {
      setIsPIP(false);
    }
}
// const handleKeyDown = (event) => {
//   if (event.keyCode === 38) { 
//   setPlaybackRate((prevPlaybackRate) => prevPlaybackRate + 0.25);
//   } else if (event.keyCode === 40) { 
//   setPlaybackRate((prevPlaybackRate) => prevPlaybackRate - 0.25);
//   }
//   };
  
//   useEffect(() => {
//   const video = document.getElementById('lesson-video');
//   video.addEventListener('keydown', handleKeyDown);
//   return () => video.removeEventListener('keydown', handleKeyDown);
//   }, []);



  return (
    <div>
      {courseData ? (
        <div className='current-page'>
          <a href="/" className='back-to-all'>Course list</a>
          <h1>{courseData.title}</h1>
          {currentLesson && currentLesson.status === 'locked' ? (<h3 className='emphasis'>Lesson is locked</h3>) : (
            <div className='current-page-1-block'>
               
                <video id="lesson-video" controls className={isPIP ? "pip" : ""} onLeavePictureInPicture={handleVideoEvent} 
                src={!currentLesson ? courseData.lessons[0].link : currentLesson.link  }>
                
                </video>
               
                {currentLesson && !currentLesson.status && currentLesson.link === 'blocked'?<button onClick={() => handlePIP()}>{isPIP ? "Close PIP" : "Picture in Picture"}</button>:null}
            <div className='hint'>
                <p>Hint: You can change the video playback speed in the settings in the lower right corner. </p>
                {currentLesson && currentLesson.title?<h3>Lesson: {currentLesson.title}</h3>:null}

            </div>
            
            
            </div>)}
          <h4>{courseData.description}</h4>
          <div className='lesson-rating-status'>
            <p>Course rating: {courseData.rating}</p>
            <p>Course status: {courseData.status}</p>
          </div>
          
          <ol className='lesson-list'><h3>This course develops the following skills and abilities: </h3>
            {courseData.meta.skills.map(sk =><li key={sk}>{sk}</li>)}</ol>    
          <h4>Total duration of the course: {courseData.duration} minuts</h4>  
          <ol>
            <h3>This course includes the following lessons:</h3>
              {courseData.lessons.map((lesson, index) => (
              <li key={lesson.id} onClick={() => handleLessonClick(lesson)} className={`course-single-block white-on-blu ${lesson.viewed ? "viewed" : ""}`}>
                <div className='course-single-container'> 
                  <h3>{lesson.title}</h3>
                  <img src={`${lesson.previewImageLink}/lesson-${index+1}.webp`} alt="" className='lesson-image-prew'/>
                  <div className='lesson-inf'>
                    <p>Duration of the lesson: {lesson.duration} minuts</p>
                    <p>Status: {lesson.status}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          
        </div>
      ) : (<p>Loading... Wait please</p>)}
    </div>
  );
 
}

export default Current;


