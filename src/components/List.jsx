import React, { useEffect, useState } from 'react';
import { useGetLaunchesMutation, useGetRocketsQuery } from '../redux/spaceXApi';
import './List.scss';

const List = () => {
  const [launches, setLaunches] = useState([]);
  const { data: rockets = [] } = useGetRocketsQuery([]);
  const [getSuccessLaunches, { isLoading }] = useGetLaunchesMutation();
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    const fetchLaunches = async () => {
      if (rockets.length > 0) {
        const response = await getSuccessLaunches({
          query: {
            date_utc: {
              $gte: '2015-01-01T00:00:00.000Z',
              $lte: '2019-12-31T23:59:59.999Z',
            },
            success: true,
          },
          options: {
            limit: 100,
          },
        });
        setLaunches(response.data.docs);
      }
    };
    fetchLaunches();
  }, [rockets]);

  const sortMethods = {
    false: {
      method: (a, b) =>
        new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime(),
    },
    true: {
      method: (a, b) =>
        new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime(),
    },
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="wrapper">
      <button
        className="custom__button"
        onClick={() => setIsSorting((prev) => !prev)}
        role="button"
      >
        Фильтровать по {isSorting ? 'убыванию' : 'возрастанию'}
      </button>
      <div className="custom__plates">
        {launches
          .slice()
          .sort(sortMethods[isSorting].method)
          .map((launch) => {
            const date = new Date(launch.date_utc).toLocaleDateString();
            const rocket = rockets.find(({ id }) => id === launch.rocket);
            return (
              <div key={launch.id} className="custom__plate">
                <div className="custom__title">
                  <p>Миссия: {launch.name}</p>
                  <p>Дата запуска: {date}</p>
                </div>
                <div className="custom__description">
                  <p>
                    <b>Описание: </b>
                    {launch.details}
                  </p>
                  <img src={rocket.flickr_images[0]} alt="rocket" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default List;
