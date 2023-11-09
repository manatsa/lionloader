import * as React from "react";
import * as Yup from "yup";
import ProductMultiStepForm from "./mutiform/ProductMultiStepForm.jsx";
import {useState} from "react";
import ProductStep1 from "./mutiform/productStep1.jsx";
import ProductStep2 from "./mutiform/productStep2.jsx";
import ProductStep3 from "./mutiform/productStep3.jsx";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import ProductStep4 from "./mutiform/productStep4.jsx";

export default function EditProductDialog({showErrorFeedback, showSuccessFeedback, selectedProduct, token, refreshProducts, setOpenNewProductDialog}) {

    const [mergedValues, setMergedValues] = useState(selectedProduct||{});
    const initialValues=[
        {
            name:mergedValues['name'] || '',
            description: mergedValues['description'] || '',
            price: mergedValues['price'] || null,
            tags: mergedValues['tags'] || ''
        },
        {
            discountType: mergedValues['discountType'] || '',
            discount: mergedValues['discount'] || '',
            coupon: mergedValues['coupon'] || '',
            promotionStartDate: mergedValues['promotionEndDate'] || '',
            promotionEndDate:mergedValues['promotionEndDate'] || '',
        },
        {
            owner: {name:mergedValues['owner']?.name, value:mergedValues['owner']?.id} || null,
            category: mergedValues['category']?{name:mergedValues['category']?.name, value: mergedValues['owner']?.id} : null,
            effectiveDate: mergedValues['effectiveDate'] || ''
        },
        {
            picture: mergedValues['pictures'] || ''
        }
    ];

    const productValidationSchema=[
        Yup.object().shape({
            name: Yup.string().required('Please enter name of product'),
            description: Yup.string(),
            price: Yup.string().required('Please enter price of product.'),
            tags: Yup.string().required('Please enter at least one tag.')
        }),
        Yup.object().shape({
            discountType: Yup.string().optional(),
            discount: Yup.string().optional(),
            coupon: Yup.string().optional(),
            promotionStart: Yup.string().optional(),
            promotionEnd:Yup.string().optional(),
        }),
        Yup.object().shape({
            owner: Yup.object().nonNullable().required('Please select the product owner'),
            category: Yup.string().required('Please select product category.'),
            effectiveDate: Yup.string().required('Please enter product effective date.')
        }),
        Yup.object().shape({
            picture: Yup.string().optional()
        })
    ]

    const stepLabels=[
        {label:'General Info'},
        {label:'Promotion Info'},
        {label:'Other Info'},
        {label:'Images Upload'}
    ]

    const steps=[ ProductStep1, ProductStep2, ProductStep3, ProductStep4 ]

    const productMutation=useMutation({
        mutationFn: data=>doUpdate('api/products/',token, data?.id, data?.product),
        onError: error => showErrorFeedback(error),
        onSuccess: (data, variables, context) => {
            refreshProducts(data);
            setOpenNewProductDialog(false)
            showSuccessFeedback();
        }
    })
    const submit=values=>{
        const product={...values, owner:values['owner']?.id};
        productMutation.mutate({id:values?.id||'',product})
        setMergedValues(initialValues)
    }


    return (
        <ProductMultiStepForm
            steps={steps}
            stepLabels={stepLabels}
            initialValues={initialValues}
            validationSchema={productValidationSchema}
            mergedValues={mergedValues}
            setMergedValues={setMergedValues}
            onSubmit={submit}
            token={token}
        />
    );
}
