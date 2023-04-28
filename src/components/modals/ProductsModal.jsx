import { Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategoriesApi } from '../../slices/categoriesSlice';
import { commonModalIsOpen } from '../../slices/modalSlice';
import { createProductApi, getAllProductsApi, getSingleProductApi, updateProductApi } from '../../slices/productsSlice';
import { userId } from '../../constants/userData';

const ProductsModal = ({ data }) => {
    const { modalIsOpen, modalType } = useSelector((state) => state.modalReducer);
    const { getAllData } = useSelector((state) => state.categoriesReducer);
    const [showIncome, setShowIncome] = useState(false);
    const [showExpense, setShowExpense] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        let productArray = [
            {
                name: values?.name,
                price: values?.price
            }
        ];
        let payload = {
            userId: userId,
            product: productArray,
            hsnCode: values.hsnCode,
            details: values.details,
            isSell: values?.isSell === false ? '0' : '1',
            isBuy: values?.isBuy === false ? '0' : '1',
            incomeCategory: values?.incomeCategory,
            expenseCategory: values?.expenseCategory,
            productStatus: 'product'
        };
        if (modalType === 'EDIT_PRODUCT') {
            payload._id = data?._id;
            dispatch(updateProductApi({ payload }));
        } else {
            dispatch(createProductApi({ payload }));
        }
        dispatch(commonModalIsOpen(false));
    };

    useEffect(() => {
        dispatch(getAllCategoriesApi());
    }, []);

    return (
        <Modal
            show={modalIsOpen}
            onHide={() => {
                dispatch(commonModalIsOpen(false));
            }}
        >
            <Modal.Header closeButton className="font-weight-bold">
                {modalType === 'EDIT_PRODUCT' ? 'Edit Product' : 'Add New Product'}
            </Modal.Header>
            <Modal.Body className="modal-scrollable">
                <Formik
                    enableReinitialize
                    initialValues={
                        modalType === 'EDIT_PRODUCT'
                            ? {
                                  name: data?.product?.map((val) => val?.name) || '',
                                  hsnCode: data?.hsnCode || '',
                                  price: data?.product?.map((val) => val?.price) || '',
                                  details: data?.details || '',
                                  isSell: data?.isSell === '0' ? false : true || '',
                                  isBuy: data?.isBuy === '0' ? false : true || '',
                                  incomeCategory: data?.incomeCategory || '',
                                  expenseCategory: data?.expenseCategory || ''
                              }
                            : {
                                  name: '',
                                  hsnCode: '',
                                  price: '',
                                  details: '',
                                  isSell: '',
                                  isBuy: '',
                                  incomeCategory: '',
                                  expenseCategory: ''
                              }
                    }
                    onSubmit={(values) => handleSubmit(values)}
                >
                    <Form>
                        <div className="mb-3">
                            <label className="font-weight-bold">Product Name</label>
                            <Field className="form-control" type="text" name="name" />
                        </div>
                        <div className="mb-3">
                            <label className="font-weight-bold">HSN Code</label>
                            <Field className="form-control" type="text" name="hsnCode" />
                        </div>
                        <div className="mb-3">
                            <label className="font-weight-bold">Price</label>
                            <Field className="form-control" type="number" name="price" />
                        </div>

                        <div className="mb-3">
                            <label>
                                <Field onClick={() => setShowIncome(!showIncome)} type="checkbox" name="isSell" />
                                <span className="mx-1 font-weight-bold">Sell this</span>
                            </label>
                            <p>Allow this product or service to be added to Invoices</p>

                            {showIncome === !false ? (
                                <div>
                                    <label className="font-weight-bold">Income Category</label>
                                    <Field className="form-control" name="incomeCategory" as="select">
                                        {getAllData?.map((val) => {
                                            if (val.type === 'Income') {
                                                return <option key={val?._id}>{val?.name}</option>;
                                            }
                                        })}
                                    </Field>
                                </div>
                            ) : null}
                        </div>

                        <div className="mb-3">
                            <label>
                                <Field onClick={() => setShowExpense(!showExpense)} type="checkbox" name="isBuy" />
                                <span className="mx-1 font-weight-bold">Buy this</span>
                            </label>
                            <p>Allow this product or service to be added to Bills.</p>
                            {showExpense === !false ? (
                                <div>
                                    <label className="font-weight-bold">Expense Category</label>
                                    <Field className="form-control" name="expenseCategory" as="select">
                                        {getAllData?.map((val) => {
                                            if (val.type === 'Expense') {
                                                return <option key={val?._id}>{val?.name}</option>;
                                            }
                                        })}
                                    </Field>
                                </div>
                            ) : null}
                        </div>

                        <div className="mb-3">
                            <label className="font-weight-bold">Product Details</label>
                            <Field className="form-control" as="textarea" name="details" />
                        </div>
                        <Button className="mt-3" type="submit">
                            Save
                        </Button>
                    </Form>
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ProductsModal;
