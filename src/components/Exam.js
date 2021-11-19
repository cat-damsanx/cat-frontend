import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Empty, Popover } from 'antd';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { isEmpty } from 'lodash';

import { estimateAbility, selectQuestion, checkingStop, getPlot } from '../api';
import '../styles/exam.css';

import Result from './Result'

const antIcon = (
  <LoadingOutlined style={{ fontSize: 80, color: '#74b9ff' }} spin />
);

const Exam = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  let [isDone, setIsDone] = useState(false)
  let [plotImg, setPlotImg] = useState('')

  // cat data
  let [questionIndex, setQuestionIndex] = useState(1)
  let [responsePattern, setResponsePattern] = useState([])
  let [currTheta, setCurrTheta] = useState(1)
  let [administeredItems, setAdministeredItems] = useState([])
  let [questionLevelPattern, setQuestionLevelPattern] = useState([])
  let [thetaPattern, setThetaPattern] = useState([currTheta])

  useEffect(() => {
    window.MathJax.Hub.Startup.Typeset();
  }, [data, loading]);

  useEffect(() => {
    const configMacros = `$
    \\newcommand{\\hoac}[1]{ \\left[\\begin{aligned}#1\\end{aligned}\\right.}
    \\newcommand{\\heva}[1]{\\left\\{ \\begin{aligned}{#1}\\end{aligned}\\right.}
    $`;

    document.getElementById('config_math').innerHTML = configMacros;
  });

  // get Exam, đổi câu hỏi
  useEffect(() => {
    // effect for get question
    // chỉ đổi câu hỏi khi questionIndex tăng lên
    setLoading(true);
    (async () => {
      let res = await selectQuestion({ administeredItems, currTheta })
      setData(res.data.data.exam)
      setAdministeredItems([...administeredItems, res.data.data.question_idx])

      let level = res.data.data.exam.list_questions[0].level
      setQuestionLevelPattern([...questionLevelPattern, level])

      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex])

  useEffect(() => {
    if (!responsePattern.length) return;
    // effect for estimate ability
    // chỉ chạy khi user trả lời câu hỏi
    (async () => {
      let res = await estimateAbility({ responsePattern, currTheta, administeredItems })
      setCurrTheta(res.data.data.theta)
      setThetaPattern([...thetaPattern, res.data.data.theta])
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responsePattern])

  useEffect(() => {
    if (!administeredItems.length) return;
    // checking stop rule
    // chỉ chạy khi current theta được set
    // nếu chưa dừng thì set question lên một đơn vị
    // nếu dừng rồi thì set điều kiện dừng
    (async () => {
      let res = await checkingStop({ administeredItems, currTheta })
      console.log(res.data.data.is_stop)
      if (!res.data.data.is_stop) {
        setQuestionIndex(questionIndex + 1)
      } else {
        setIsDone(res.data.data.is_stop)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currTheta, thetaPattern])

  useEffect(() => {
    (async () => {
      let res = await getPlot({ questionLevelPattern, thetaPattern, responsePattern })
      setPlotImg('')
      setPlotImg(res.data.data.b64Img)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone])

  const responseAnswer = (answer) => {
    setResponsePattern([...responsePattern, answer])
  };

  const printout = () => {
    console.log({ questionIndex, responsePattern, currTheta, administeredItems, thetaPattern, questionLevelPattern })
  }

  const renderData = () => {
    if (loading) return <div className="loading__fullscreen">{antIcon}</div>;

    if (isEmpty(data))
      return <Empty description="Không tìm thấy trong database" />;

    return data?.list_questions.map((item, key) => {
      const isGeometry = '';

      return (
        <div className="item">
          {/* here question */}
          <div className="question">
            <h3 className="question__title pointer">
              {questionIndex}.
              {item?.question_contents.map(
                (title) =>
                  (title.variety === 'TEXT' && title.content) ||
                  (title.variety === 'HTML' && parse(title.content)) ||
                  (title.variety === 'IMG' && (
                    <img
                      alt="img math"
                      src={title.content}
                      className={isGeometry && 'isGeometry'}
                      key={key}
                    />
                  ))
              )}
            </h3>

            <p className="info">
              [Time: {item?.duration}, Level: {item?.level}
              {item?.question_properties?.parametric && ', Parametric'},{' '}
              {item?.code && item?.code}]
            </p>
          </div>

          {item?.question_categories && (
            <div className="question__categories">
              {item?.question_categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          )}

          <div className="choice">
            <ul className="pointer">
              {item?.choices?.map((choice) =>
                choice?.right_choice ? (
                  <li
                    className="choice__true" // here is where color is different
                    onClick={() => { responseAnswer(1); }}
                  >
                    {(choice?.variety === 'TEXT' && choice?.content) ||
                      (choice?.variety === 'HTML' &&
                        parse(choice?.content)) ||
                      (choice?.variety === 'IMG' && (
                        <img
                          alt="img math"
                          src={choice?.content}
                          className={isGeometry && 'isGeometry'}
                        />
                      ))}
                  </li>
                ) : (
                  <li
                    className="choice"
                    onClick={() => { responseAnswer(0); }}
                  >
                    {(choice?.variety === 'TEXT' && choice?.content) ||
                      (choice?.variety === 'HTML' &&
                        parse(choice?.content)) ||
                      (choice?.variety === 'IMG' && (
                        <img
                          alt="img math"
                          src={choice?.content}
                          className={isGeometry && 'isGeometry'}
                          key={choice?.content}
                        />
                      ))}
                  </li>
                )
              )}
            </ul>

          </div>

        </div>
      );
    });
  };

  return (
    <div className="Latex">
      <div id="config_math"></div>

      {/* <MenuHeader data={[...dataMenu]} currentActive={catIndex} /> */}

      {!loading &&
        <>
          {/* <Main /> */}
          <h3 id="title">Entrance test</h3>
        </>
      }
      {!loading && (
        <div id="infomation-icon">
          <Popover
            trigger="click"
            placement="left"
            getPopupContainer={(trigger) => trigger.parentElement}
            getTooltipContainer={(trigger) => trigger.parentElement}
            zIndex={1000}
          >
            <InfoCircleOutlined style={{ fontSize: 24 }} />
          </Popover>
        </div>
      )}
      {
        printout()
      }
      {!isDone ? renderData()
        : <Result plotImg={plotImg} finalTheta={currTheta} />
      }

    </div>
  );
};

export default Exam;
