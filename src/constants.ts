/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPoint } from './types';

export const STATION_CENTER: [number, number] = [47.497, 19.026];

export const MAP_POINTS: MapPoint[] = [
  {
    id: 'loc1',
    name: 'Point 1',
    lat: 47.50076430536876,
    lng: 19.025162452894698,
    image: 'pictures/1.PNG',
    questions: [
      {
        id: 'q1_1',
        text: 'Rate the cleanliness in this area:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc2',
    name: 'Point 2',
    lat: 47.50077194274536,
    lng: 19.024676472428013,
    image: 'pictures/2.PNG',
    questions: [
      {
        id: 'q2_1',
        text: 'Rate the lighting quality in this area:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc3',
    name: 'Point 3',
    lat: 47.50020340986837, 
    lng: 19.02515314642052,
    image: 'pictures/3.jpg',
    questions: [
      {
        id: 'q3_1',
        text: 'Rate the accessibility for passengers in this area:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc4',
    name: 'Point 4',
    lat: 47.49974158490442, 
    lng: 19.024847186958123,
    image: 'pictures/4.jpg',
    questions: [
      {
        id: 'q4_1',
        text: 'Rate the clarity of signs and navigation: ',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc5',
    name: 'Point 5',
    lat: 47.50059299458684,
    lng: 19.024645021205227,
    image: 'pictures/5.PNG',
    questions: [
      {
        id: 'q5_1',
        text: 'Rate the crowd density and comfort level in this area:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc6',
    name: 'Point 6',
    lat: 47.50038270456289,
    lng: 19.024717463357458,
    image: 'pictures/6.PNG',
    questions: [
      {
        id: 'q6_1',
        text: 'Rate the ambient noise levels and acoustics:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc7',
    name: 'Point 7',
    lat: 47.49899535480241,
    lng: 19.024470937469186,
    image: 'pictures/7.PNG',
    questions: [
      {
        id: 'q7_1',
        text: 'Rate the availability of seating options nearby:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc8',
    name: 'Point 8',
    lat: 47.49530, 
    lng: 19.02625,
    image: 'pictures/8.JPG',
    questions: [
      {
        id: 'q8_1',
        text: 'Rate the personal feeling of safety in this area:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },
  {
    id: 'loc9',
    name: 'Point 9',
    lat: 47.4954291658188,
    lng: 19.026568400981102,
    image: 'pictures/9.PNG',
    questions: [
      {
        id: 'q9_1',
        text: 'Rate the usefulness of passenger details on information boards:',
        options: [
          { id: 'o1', label: 'Good / Satisfactory' },
          { id: 'o2', label: 'Acceptable / Average' },
          { id: 'o3', label: 'Poor / Needs Improvement' }
        ]
      }
    ]
  },

];

export const MAP_BACKGROUND = 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop&grayscale&blur=10';
