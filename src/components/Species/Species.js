import React, {useState, useEffect, useRef} from 'react'

import Preloader from "../Preloader";
import Error from "../Error";
import Form from "../Form";
import MainInfo from "../MainInfo";
import SubInfo from "../SubInfo";

function Species({getData}) {

    const url = 'https://swapi.dev/api/species/'

    // Объект получаемого типа
    const [specie, setSpecieData] = useState({})
    // ID типа выбранного из select
    const [specieId, setSpecieId] = useState(1)
    // Объект со всеми элементами типа
    const [allTypeData, setAllTypeData] = useState({})
    // Массив имен людей получаемый при загрузке страницы
    const [selectData, setSelectData] = useState([])
    // Состояние ошибки
    const [error, setError] = useState()
    // Состояние прелодера
    const [preloader, setPreloaderStatus] = useState(true)
    // Массив типов, получаемый после первой прогрузки объекта
    const [specieType, setSpecieType] = useState([])

    // Пропуск первого запуска функции getSpecieType при рендере
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            getSpecieType()
        }
    }, [specie]);
    // Конец пропуска

    // Получить все имена планет при первом рендере страницы
    useEffect(() => {
        getData(url).then(({data}) => {
            setAllTypeData(data)
        })
    }, [])

    useEffect(() => {
        if (Object.keys(allTypeData).length !== 0) {
            setSelectData((selectData) => [...selectData, ...allTypeData.results.map(it => it.name)])
            if (allTypeData.next !== null) {
                getData(allTypeData.next).then(({data}) => {
                    setAllTypeData(data)
                })
            } else {
                setPreloaderStatus(false)
            }
        }
    }, [allTypeData])
    // Конец получения всех имен планет

    const sendData = (e) => {
        setSpecieType([])
        e.preventDefault()
        if (specieId > 0 && specieId < 61) {
            getData(`${url}${specieId}`).then(({data}) => {
                setSpecieData(data)
                setError(false)
            })
        } else {
            setError(true)
        }
    }
    // Конец получения всех типов

    // Получить типы
    const getSpecieType = () => {
        specie.people.map((it) => getData(it).then(({data}) => {
            setSpecieType((prev) => [...prev, data])
        }))
    }

    // Обновить ID типа
    const updateSpecieId = (e) => {
        setSpecieId(e.target.value)
    }

    return (
        <div className='planets'>
            {preloader ?
                <Preloader/>
                :
                <Form formName="Species" sendData={sendData} selectData={selectData} updateId={updateSpecieId}/>
            }

            {error ?
                <Error/>
                :
                error === undefined ?
                    null
                    :
                    <MainInfo data={specie} maxCount={8}/>
            }

            {specieType.length !== 0 ?
                <SubInfo data={specieType} maxCount={3} fields={["name"]}/>
                :
                null
            }
        </div>
    )
}

export default Species