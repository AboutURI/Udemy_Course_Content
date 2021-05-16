import React from 'react';
import CourseContent from './components/CourseContent.jsx';
import axios from 'axios';
import {initialCourse} from '../../config.js';
import {Div} from './components/StyledComponents';
import qs from 'qs';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const queries = qs.parse(window.location.search);
    const courseId = Number(queries['?courseId']);
    this.setState({courseId});
    console.log();
  }

  render() {
    return (
      <Div>
        {this.state.courseId &&
          <CourseContent courseId={this.state.courseId} />
        }
      </Div>
    );
  }
}

export default App;