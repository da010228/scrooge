import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PaymentItem from "./PaymentItem";
import PaymentAdd from "./PaymentAdd";
import styles from "./PaymentHistory.module.css";
import Modal from "../../components/UI/Modal";

const PaymentHistory = ({
  todayProp,
  total,
  getTotal,
  todaySettlement,
  consumFalseHandler,
  handleSetTrue,
  handleSetFalse,
}) => {
  const globalToken = useSelector((state) => state.globalToken); //렌더링 여러번 되는 기분?

  const [data, setData] = useState();
  const [date, setDate] = useState(todayProp);
  const [origin, setOrigin] = useState();

  const [settlement, setSettlement] = useState(todaySettlement);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getPaymentHistory(todayProp[0], todayProp[1]);
  }, []);

  const handleOpenModal = () => {
    // 소비가 0건인 경우 예외 처리
    if (data.length < 1) {
      setOrigin(0);
      if (date[0] === todayProp[0] && date[1] === todayProp[1]) {
        postExp();
      }
      setSettlement(true);
      return;
    }
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  //전날로 이동
  const datebeforeHandler = () => {
    const [currentMonth, currentDay] = date;
    const previousDate = new Date();
    previousDate.setMonth(currentMonth - 1);
    previousDate.setDate(currentDay - 1);
    setDate([previousDate.getMonth() + 1, previousDate.getDate()]);

    getPaymentHistory(previousDate.getMonth() + 1, previousDate.getDate());
  };

  //다음날로 이동
  const dateafterHandler = () => {
    const [currentMonth, currentDay] = date;
    const nextDate = new Date();
    nextDate.setMonth(currentMonth - 1);
    nextDate.setDate(currentDay + 1);
    const todayDate = new Date();
    if (nextDate <= todayDate) {
      setDate([nextDate.getMonth() + 1, nextDate.getDate()]);
      getPaymentHistory(nextDate.getMonth() + 1, nextDate.getDate());
    }
  };

  const goNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (date[0] === todayProp[0] && date[1] === todayProp[1]) {
        console.log(goNext);
        postExp();
        handleSetTrue();
      }
      const formattedDate = `2023-${date[0]
        .toString()
        .padStart(2, "0")}-${date[1].toString().padStart(2, "0")}`;

      setOrigin(getTotal(formattedDate));
      setSettlement(true);
      handleCloseModal();
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 소비 내역 불러오기
  const getPaymentHistory = (month, day) => {
    const formattedDate = `2023-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const postData = {
      method: "GET",
      headers: {
        Authorization: globalToken,
      },
    };

    fetch(
      `https://day6scrooge.duckdns.org/api/payment-history/date/${formattedDate}`,
      postData
    )
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
        const index = data.findIndex((item) => !item.isSettled);
        //모든 항목 정산 완료 / data가 없거나
        if (index === -1) {
          //소비 내역이 없을 때, 오늘 제외 무조건 정산 완료로
          if (data.length === 0) {
            if (month === todayProp[0] && day === todayProp[1]) {
              setSettlement(todaySettlement);
            } else {
              setSettlement(true);
            }
          } else {
            setSettlement(true);
          }
          setOrigin(getTotal(formattedDate));
          setOrigin(total);
          setCurrentIndex(data.length);
        } else {
          //정산 안 된
          setSettlement(false);
          setCurrentIndex(index);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setOrigin(total);
  }, [total]);

  const onCreate = (targetId, usedAt, amount, paidAt, cardName) => {
    const newItem = {
      id: targetId,
      paidAt,
      amount,
      usedAt,
      cardName,
    };
    if (date === todayProp) {
      handleSetFalse();
    }
    setData([...data, newItem]);
    setSettlement(false);
  };

  const onEdit = (targetId, amount, usedAt, cardName, category) => {
    const obj = {
      amount,
      usedAt,
      cardName,
      category,
    };
    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: globalToken,
      },
      body: JSON.stringify(obj),
    };
    fetch(
      `https://day6scrooge.duckdns.org/api/payment-history/${targetId}`,
      postData
    )
      .then((res) => res.text())
      .then(console.log);
    setData(
      data.map((it) =>
        it.id === targetId ? { ...it, cardName, amount, usedAt } : it
      )
    );
  };

  // 일일정산 경험치 추가
  const postExp = () => {
    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: globalToken,
      },
    };
    fetch(
      "https://day6scrooge.duckdns.org/api/payment-history/settlement-exp",
      postData
    ).then((res) => {
      res.text();
    });
  };

  return (
    <div>
      <div className={styles.empty}>
        <img
          src={`${process.env.PUBLIC_URL}/images/back.png`}
          onClick={consumFalseHandler}
          alt="뒤로"
        />
      </div>
      <div className={styles.body}>
        <div className={styles.card}>
          <div className={styles.title}>
            <img
              src={`${process.env.PUBLIC_URL}/images/left.svg`}
              onClick={datebeforeHandler}
              alt="왼쪽"
            />
            <div className={styles.date}>
              {date[0]}월 {date[1]}일 소비
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/images/right.svg`}
              onClick={dateafterHandler}
              alt="오른쪽"
            />
          </div>

          <div className={styles.scrollitem}>
            <div className={styles.item}>
              {data && data.length > 0 ? (
                data.map((it, index) => (
                  <PaymentItem key={index} {...it} onEdit={onEdit} />
                ))
              ) : (
                <h4>소비 내역이 없습니다 {settlement}</h4>
              )}
              <PaymentAdd onCreate={onCreate} date={date} />
            </div>
          </div>
          <div className={styles.foot}>
            {settlement ? (
              <div className={styles.total}>
                {origin || origin === 0
                  ? `총합: ${origin
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`
                  : ""}
              </div>
            ) : (
              <div className={styles.btns}>
                <button onClick={handleOpenModal} className={styles.btn}>
                  정산하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {modal && data && (
        <Modal
          item={data[currentIndex]}
          index={currentIndex}
          goNext={goNext}
          onEdit={onEdit}
          onCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PaymentHistory;
