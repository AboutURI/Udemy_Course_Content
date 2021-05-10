import React from 'react';
import axios from 'axios';
import Section from './Section.jsx';
import ContentHeader from './ContentHeader.jsx';
import '../main.css';
import qs from 'qs';

class CourseContent extends React.Component {

  constructor(props) {
    super(props);
    const queries = qs.parse(window.location.search);
    const courseId = Number(queries['?courseId']);

    this.state = {
      course: {},
      isLoaded: false,
      courseId
    };

  }

  componentDidMount() {

    axios.get(`/course/item?courseId=${this.state.courseId}`)
      .then((response) => {
        this.setState({
          isLoaded: true,
          course: response.data
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });

  }

  componentWillUnMount() {
    this.cancel();
  }

  render() {

    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <ContentHeader totalSections={this.state.course.totalSections} totalLectures={this.state.course.totalLectures} totalArticles={this.state.course.totalArticles} courseLength={this.state.course.courseLength}/>
          <br/>
          <br/>
          <div id="courseSectionsBlock">
            {this.state.course.sections.length > 0 &&
              this.state.course.sections.map(section => (
                <Section key={`section${section.sectionId}`} section={section} />
              ))}
          </div>
        </div>
      );
    }

  }

}

export default CourseContent;