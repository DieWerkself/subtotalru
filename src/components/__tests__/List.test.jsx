import 'whatwg-fetch';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  useGetLaunchesMutation,
  useGetRocketsQuery,
} from '../../redux/spaceXApi';
import List from '../List';

jest.mock('../../redux/spaceXApi');

describe('List component', () => {
  beforeEach(() => {
    useGetRocketsQuery.mockClear();
    useGetLaunchesMutation.mockClear();
  });

  const mockDataRockets = [
    {
      flickr_images: ['https://imgur.com/DaCfMsj.jpg'],
      id: '5e9d0d95eda69973a809d1ec',
    },
    {
      flickr_images: ['https://imgur.com/DaCfMsj.jpg'],
      id: '5e9d0d95eda69973a809d1ty',
    },
  ];

  const mockDataLaunches = () => {
    return {
      data: {
        docs: [
          {
            rocket: '5e9d0d95eda69973a809d1ec',
            details: 'Description',
            name: 'CRS-20',
            date_utc: '2020-03-07T04:50:31.000Z',
            id: '5eb87d42ffd86e000604b384',
          },
          {
            rocket: '5e9d0d95eda69973a809d1ty',
            details: 'Description',
            name: 'CRS-6',
            date_utc: '2015-04-14T20:10:00.000Z',
            id: '5eb87cecffd86e000604b33f',
          },
        ],
      },
    };
  };

  it('List renders', async () => {
    useGetRocketsQuery.mockReturnValue({
      data: mockDataRockets,
    });
    useGetLaunchesMutation.mockReturnValue([
      mockDataLaunches,
      { isLoading: false },
    ]);

    render(<List />);
    expect(screen.queryByText('Loading...')).toBeNull();

    await waitFor(() => {
      expect(screen.queryByText(/CRS-20/i)).toBeInTheDocument();
      expect(screen.queryByText(/CRS-6/i)).toBeInTheDocument();
    });
  });

  it('List sorting', async () => {
    useGetRocketsQuery.mockReturnValue({
      data: mockDataRockets,
    });
    useGetLaunchesMutation.mockReturnValue([
      mockDataLaunches,
      { isLoading: false },
    ]);

    render(<List />);

    await waitFor(() => {
      const e1 = screen.getByText(/CRS-20/i);
      const e2 = screen.getByText(/CRS-6/i);
      const handler = screen.getByText(/Фильтровать/i);
      expect(e1.compareDocumentPosition(e2)).toBe(4);
      expect(e2.compareDocumentPosition(e1)).toBe(2);
      fireEvent.click(handler);
      expect(e1.compareDocumentPosition(e2)).toBe(2);
      expect(e2.compareDocumentPosition(e1)).toBe(4);
      fireEvent.click(handler);
      expect(e1.compareDocumentPosition(e2)).toBe(4);
      expect(e2.compareDocumentPosition(e1)).toBe(2);
    });
  });
});
