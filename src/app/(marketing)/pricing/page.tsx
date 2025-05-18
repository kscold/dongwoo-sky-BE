'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTruckMoving, FaBuilding, FaRegClock, FaCalculator, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import { IconType } from 'react-icons';
import * as styles from '@/styles/pricing.css'; // Vanilla Extract 스타일 import

// 타입 정의
interface ChoiceDetail {
  label: string;
  basePrice?: number;
  perFloorIncrement?: number;
  floorThreshold?: number;
  basePriceHalfDay?: number;
  basePriceFullDay?: number;
}

interface OptionConfig {
  label: string;
  type: 'slider' | 'select' | 'radio';
  min?: number;
  max?: number;
  defaultValue: string | number;
  unit?: string;
  choices?: Record<string, ChoiceDetail>;
}

interface TruckOptions extends Record<string, OptionConfig> {}

interface TruckData {
  name: string;
  icon: IconType;
  options: TruckOptions;
}

interface PricingData extends Record<string, TruckData> {}

const pricingData: PricingData = {
  general: {
    name: '일반 사다리차',
    icon: FaTruckMoving,
    options: {
      floor: {
        label: '층수',
        type: 'slider',
        min: 2,
        max: 25,
        defaultValue: 5,
        unit: '층',
      },
      workType: {
        label: '작업 종류',
        type: 'select',
        defaultValue: 'oneHour',
        choices: {
          singleFurniture: { label: '가구 1개 (기본 5층까지)', basePrice: 70000, perFloorIncrement: 10000, floorThreshold: 5 },
          oneHour: { label: '1시간 작업 (기본 5층까지)', basePrice: 120000, perFloorIncrement: 10000, floorThreshold: 5 },
          halfDay: { label: '반나절 (4시간)', basePrice: 350000 },
          fullDay: { label: '하루 (8시간)', basePrice: 550000 },
        },
      },
    },
  },
  sky: {
    name: '스카이 사다리차',
    icon: FaBuilding,
    options: {
      tonnage: {
        label: '톤수 및 최대 높이',
        type: 'select',
        defaultValue: '3.5t',
        choices: {
          '3.5t': { label: '1~3.5톤 (최대 25m)', basePriceHalfDay: 400000, basePriceFullDay: 600000 },
          '5t': { label: '5톤 (최대 45m)', basePriceHalfDay: 500000, basePriceFullDay: 700000 },
          '8t': { label: '8톤 (최대 54m)', basePriceHalfDay: 700000, basePriceFullDay: 900000 },
          '17t': { label: '17톤 (최대 65m)', basePriceHalfDay: 900000, basePriceFullDay: 1200000 },
          '19t': { label: '19톤 (최대 75m)', basePriceHalfDay: 1300000, basePriceFullDay: 1800000 },
        },
      },
      workDuration: {
        label: '작업 시간',
        type: 'radio',
        defaultValue: 'halfDay',
        choices: {
          halfDay: { label: '반나절 (오전/오후)' },
          fullDay: { label: '하루' },
        },
      },
    },
  },
};

interface SelectedOptions extends Record<string, string | number> {}

export default function PricingPage() {
  const router = useRouter();
  const [selectedTruck, setSelectedTruck] = useState<string>('general');
  const [options, setOptions] = useState<SelectedOptions>({});
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  useEffect(() => {
    const currentTruckOptions = pricingData[selectedTruck].options;
    const initialOptions: SelectedOptions = {};
    for (const key in currentTruckOptions) {
      initialOptions[key] = currentTruckOptions[key].defaultValue;
    }
    setOptions(initialOptions);
  }, [selectedTruck]);

  useEffect(() => {
    calculatePrice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, selectedTruck]);

  const handleOptionChange = (optionKey: string, value: string | number) => {
    setOptions(prev => ({ ...prev, [optionKey]: value }));
  };

  const calculatePrice = () => {
    const currentTruckData = pricingData[selectedTruck];
    let price = 0;

    if (!currentTruckData || Object.keys(options).length === 0) {
        setEstimatedPrice(0);
        return;
    }

    if (selectedTruck === 'general') {
      const floor = parseInt(String(options.floor), 10);
      const workType = String(options.workType);
      const workTypeData = currentTruckData.options.workType.choices?.[workType];
      
      if (workTypeData?.basePrice !== undefined) {
        price = workTypeData.basePrice;
        if (workTypeData.perFloorIncrement && workTypeData.floorThreshold !== undefined && floor > workTypeData.floorThreshold) {
          price += (floor - workTypeData.floorThreshold) * workTypeData.perFloorIncrement;
        } 
      }
    } else if (selectedTruck === 'sky') {
      const tonnage = String(options.tonnage);
      const tonnageData = currentTruckData.options.tonnage.choices?.[tonnage];
      const workDuration = String(options.workDuration);

      if (tonnageData) {
        if (workDuration === 'fullDay' && tonnageData.basePriceFullDay !== undefined) {
            price = tonnageData.basePriceFullDay;
        } else if (workDuration === 'halfDay' && tonnageData.basePriceHalfDay !== undefined) {
            price = tonnageData.basePriceHalfDay;
        }
      }
    }
    setEstimatedPrice(price);
  };

  const handleInquiry = () => {
    const inquiryDetails = {
      truckType: pricingData[selectedTruck].name,
      options: Object.entries(options).reduce((acc, [key, value]) => {
        const truckOpt = pricingData[selectedTruck].options[key];
        if (truckOpt) {
            if (truckOpt.type === 'select' || truckOpt.type === 'radio') {
                acc[truckOpt.label] = truckOpt.choices?.[String(value)]?.label || String(value);
            } else {
                acc[truckOpt.label] = `${String(value)}${truckOpt.unit || ''}`;
            }
        }
        return acc;
      }, {} as Record<string, string>),
      estimatedPrice: estimatedPrice.toLocaleString(),
    };
    const query = encodeURIComponent(JSON.stringify(inquiryDetails));
    router.push(`/contact?details=${query}`);
  };

  const CurrentIcon = pricingData[selectedTruck]?.icon || FaTruckMoving;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>
            실시간 요금 계산기
          </h1>
          <p className={styles.subTitle}>
            필요한 장비와 작업 조건을 선택하고, 합리적인 예상 비용을 바로 확인해보세요.
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>1. 차량 종류 선택</h2>
          <div className={styles.truckSelectorGrid}>
            {Object.keys(pricingData).map(key => {
              const Icon = pricingData[key].icon;
              const isSelected = selectedTruck === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTruck(key)}
                  className={isSelected ? styles.truckButtonSelected : styles.truckButtonDefault}
                >
                  <Icon className={`${styles.truckIcon} ${isSelected ? styles.truckIconSelected : styles.truckIconDefault}`} />
                  <span className={styles.truckButtonText}>{pricingData[key].name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedTruck && pricingData[selectedTruck] && (
          <div className={styles.card}>
            <div className={`${styles.cardTitle} ${styles.optionHeaderContainer}`}>
              <CurrentIcon className={styles.optionHeaderIcon} /> 
              <h2>
                {pricingData[selectedTruck].name} 상세 옵션
              </h2>
            </div>

            <div className={styles.optionsSectionContainer}>
              {Object.entries(pricingData[selectedTruck].options).map(([key, config]) => (
                <div key={key} className={styles.optionItem}>
                  <label htmlFor={key} className={styles.optionLabel}>
                    {config.label}
                  </label>
                  {config.type === 'slider' && (
                    <div className={styles.sliderContainer}>
                      <input
                        type="range"
                        id={key}
                        min={config.min}
                        max={config.max}
                        value={options[key] || config.defaultValue}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className={styles.sliderInput}
                      />
                      <span className={styles.sliderValueDisplay}>
                        {options[key] || config.defaultValue} {config.unit}
                      </span>
                    </div>
                  )}
                  {config.type === 'select' && config.choices && (
                    <div className={styles.selectContainer}>
                      <select
                        id={key}
                        value={options[key] || config.defaultValue}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className={styles.selectInput}
                      >
                        {Object.entries(config.choices).map(([value, details]) => (
                          <option key={value} value={value}>{details.label}</option>
                        ))}
                      </select>
                      <FaChevronDown className={styles.selectIcon} />
                    </div>
                  )}
                  {config.type === 'radio' && config.choices && (
                    <div className={styles.radioGroup}>
                      {Object.entries(config.choices).map(([value, details]) => (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(key, value)}
                          className={options[key] === value ? styles.radioButtonSelected : styles.radioButtonDefault}
                        >
                          {details.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          
            <div className={styles.priceDisplaySection}>
              <div className={styles.priceDisplayCard}>
                <FaCalculator className={styles.priceIcon} />
                <p className={styles.priceLabel}>예상 작업 비용</p>
                <p className={styles.priceValue}>
                  {estimatedPrice > 0 ? `${estimatedPrice.toLocaleString()} 원` : '옵션을 선택해주세요'}
                </p>
                <p className={styles.priceInfoText}>
                  <FaInfoCircle className={styles.infoIcon} /> 위 금액은 일반적인 경우의 예상 비용이며, 실제 현장 조건, 작업 난이도, 추가 요청 사항에 따라 변동될 수 있습니다.
                </p>
              </div>
            </div>

            <div className={styles.inquiryButtonContainer}>
              <button
                onClick={handleInquiry}
                disabled={estimatedPrice === 0}
                className={styles.inquiryButton}
              >
                선택 조건으로 견적 문의하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 