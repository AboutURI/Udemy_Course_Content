import React from 'react';
import axios from 'axios';
import Section from './Section.jsx';
import {Container, CourseSectionsBlock, H2, H3, Br} from './StyledComponents.js';
import ContentHeader from './ContentHeader.jsx';
import MoreSections from './MoreSections.jsx';
import qs from 'qs';

class CourseContent extends React.Component {

  constructor(props) {
    super(props);
    const queries = qs.parse(window.location.search);
    const courseId = Number(queries['?courseId']);

    this.state = {
      courseId,
      course: {},
      isLoaded: false,
      allExpanded: false,
      host: 'localhost:9800',
      // host: 'ec2-18-130-234-175.eu-west-2.compute.amazonaws.com:9800'
      // host: '127.0.0.1:9800',
      displayMoreSections: false
    };
    this.expandOrCollapseAll = this.expandOrCollapseAll.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.showMoreSections = this.showMoreSections.bind(this);
  }

  setDisplay(course) {

    for (let i = 0; i < course.sections.length; i++) {
      if (i === 0) {
        course.sections[i].sectionDisplay = 'block';
        course.sections[i].elementDisplay = 'block';
      } else if (i <= 9) {
        course.sections[i].sectionDisplay = 'block';
        course.sections[i].elementDisplay = 'none';
      } else {
        course.sections[i].sectionDisplay = 'none';
        course.sections[i].elementDisplay = 'none';
      }
    }

    return course;
  }

  componentDidMount() {

    axios.get(`http://${this.state.host}/course/item?courseId=${this.state.courseId}`)
      .then((response) => {
        const course = this.setDisplay(response.data);
        const displayMoreSections = course.sections.length <= 10;
        this.setState({
          isLoaded: true,
          course,
          displayMoreSections
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }

        let status;
        if (err.response) {
          if (err.response.status) {
            status = err.response.status;
          }
        } else {
          status = 500;
        }

        let data;
        if (err.response) {
          if (err.response.data) {
            data = err.response.data;
          }
        } else {
          data = 'Internal Server Error';
        }

        this.setState({error: {
          status,
          data}, isLoaded: true });
      });

  }

  expandAll() {
    if (!this.state.displayMoreSections) {
      this.showMoreSections();
    }
    let course = this.state.course;
    for (let i = 0; i < course.sections.length; i++) {
      course.sections[i].elementDisplay = 'block';
    }
    this.setState({
      course,
      allExpanded: true
    });
  }

  collapseAll() {
    let course = this.state.course;
    for (let i = 0; i < course.sections.length; i++) {
      course.sections[i].elementDisplay = 'none';
    }
    this.setState({
      course,
      allExpanded: false
    });
  }

  toggleView(idx) {
    const course = this.state.course;
    if (course.sections[idx].elementDisplay === 'block') {
      course.sections[idx].elementDisplay = 'none';
    } else {
      course.sections[idx].elementDisplay = 'block';
    }
    this.setState({course});
  }

  showMoreSections() {
    const course = this.state.course;
    for (let i = 0; i < course.sections.length; i++) {
      course.sections[i].sectionDisplay = 'block';
    }

    this.setState({
      course,
      displayMoreSections: true
    });
  }

  expandOrCollapseAll() {
    if (this.state.allExpanded) {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }

  render() {

    if (!this.state.isLoaded) {
      return <Container>Loading...</Container>;
    } else if (this.state.error) {
      return (
        <Container>
          <H2>Course  Error</H2>
          <H3>{`Error ${this.state.error.status} ${this.state.error.data}`}</H3>
        </Container>
      );
    } else {
      return (
        <Container>
          <ContentHeader totalSections={this.state.course.totalSections} totalLectures={this.state.course.totalLectures} totalArticles={this.state.course.totalArticles} courseLength={this.state.course.courseLength} expandOrCollapseAll={this.expandOrCollapseAll} allExpanded={this.state.allExpanded}/>
          <Br/>
          <CourseSectionsBlock>
            {this.state.course.sections.length > 0 &&
                this.state.course.sections.map((section, idx) => {
                  return <Section idx={idx} key={`section${section.sectionId}`} section={section} toggleView={this.toggleView}/>;
                })}
          </CourseSectionsBlock>
          {!this.state.displayMoreSections &&
              <MoreSections id="moreSections" showMoreSections={this.showMoreSections} numberOfSections={this.state.course.sections.length}/>
          }
        </Container>
      );
    }

  }

}

export default CourseContent;
