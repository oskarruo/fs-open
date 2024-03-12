const Course = (props) => {
    const course = props.course
    return (
      <div>
        <Header course={course}/>
        <Content course={course}/>
        <Total course={course}/>
      </div>
    )
  }
  
  const Header = (props) => {
    return (
      <div>
        <h1>{props.course.name}</h1>
      </div>
    )
  }
  
  const Content = (props) => {
    return (
      <div>
          {
            props.course.parts.map((part, index) => (
              <Part key={index} part={part} />
            ))
          }
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>
          {props.part.name} {props.part.exercises}
        </p>
      </div>
    )
  }
  
  const Total = (props) => {
    const total = props.course.parts.reduce((totalexercises, part) => {
      return totalexercises + part.exercises;
    }, 0)
    return (
      <div>
        <p>
          Number of exercises {total} 
        </p>
      </div>
    )
  }

export default Course
