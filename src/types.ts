/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  image: string;
  questions: Question[];
}

export interface SurveyState {
  completedPoints: string[];
  answers: Record<string, string>; // questionId -> optionId
}

export interface CompletedSurvey {
  id: string;
  nickname: string;
  answers: Record<string, string>;
  completedAt: string;
}
