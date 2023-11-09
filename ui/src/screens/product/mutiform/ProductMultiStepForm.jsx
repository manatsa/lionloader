import React, {useState} from 'react';
import {Steps} from "primereact/steps";

const ProductMultiStepForm = ({
                                  steps,
                                  initialValues,
                                  validationSchema,
                                  stepLabels,
                                  onSubmit,
                                  mergedValues,
                                  setMergedValues,
                                  token,
                              }) => {
    const [currentStep, setCurrentStep] = useState(0);

    let currentInitValues = initialValues[currentStep];

    let currentValidationSchema = validationSchema[currentStep];

    const isFirstStep = () => {
        return currentStep === 0;
    };

    const submit = currentStep >= initialValues.length - 1 ? true : false;


    const onNextStep = (value) => {
        let mVals = { ...mergedValues, ...value };

        setMergedValues(mVals);
        if (submit) {
            onSubmit(mVals);
            setCurrentStep(0);
        } else {
            let nextStep = currentStep + 1;
            setCurrentStep(nextStep);
        }
    };

    const onBack = () => {
        if (!isFirstStep()) {
            let previousStep = currentStep - 1;
            setCurrentStep(previousStep);
        }
    };

    const currentStepComponent = steps[currentStep];

    if (Object.keys(steps).length !== stepLabels.length) {
        throw new Error(
            "Number of defined steps should match number of step labels."
        );
    }
    return(
        <>
            <div className="grid">
                <div className="col-12">
                    <Steps model={stepLabels} activeIndex={currentStep} onSelect={(e) => setCurrentStep(e.index)} readOnly={true}/>
                </div>
                <div className="col-12">
                    {React.createElement(
                        currentStepComponent,
                        {
                            initValues: currentInitValues,
                            validationSchema: currentValidationSchema,
                            onNextStep: onNextStep,
                            onBack: onBack,
                            token: token,

                        },
                        ""
                    )}

                </div>
            </div>

        </>
    )
}

export default  ProductMultiStepForm;