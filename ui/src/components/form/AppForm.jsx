import { Formik, Form } from "formik";
import React from "react";
import {Button} from "primereact/button";
import {SplitButton} from "primereact/splitbutton";



const AppForm = ({
  initialValues,
  onSubmit,
  validationSchema,
  children,
    onBack,
  isFirstStep,
  isLastStep
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
    >
      {({handleSubmit, isSubmitting, resetForm }) =><>
      <Form onSubmit={handleSubmit} style={{width:'100%'}} >

        {children}

        <div className={`col-12 flex ${isFirstStep?'justify-content-around':'justify-content-around'}`}>
          {!isFirstStep && <Button severity={'warning'} label={'Back'} type={'button'} onClick={onBack} />}
          <Button severity={'secondary'} label={'Clear'} type={'button'} onClick={resetForm} />
          <Button severity={'success'} icon={`${isSubmitting?'pi pi-spin pi-spinner':isLastStep?'pi pi-upload':'pi pi-arrow-right'}`} label={isLastStep?'Save':'Next'} type={'submit'} />
        </div>
      </Form>
      </>
      }

    </Formik>
  );
};

export default AppForm;
