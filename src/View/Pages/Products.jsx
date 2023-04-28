import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CommonDataTable from '../../components/CommonDataTable';
import DeleteConfModal from '../../components/modals/DeleteConfModal';
import ProductsModal from '../../components/modals/ProductsModal';
import { commonDeleteModal, commonModalIsOpen, commonModalType } from '../../slices/modalSlice';
import { getAllProductsApi } from '../../slices/productsSlice';
// import '../../components/CommonIcons.css';

const Products = () => {
    const columns = [
        {
            name: '#',
            selector: (row) => row?.index,
            sortable: true
        },
        {
            name: 'Name',
            selector: (row) => row?.product?.map((data) => data?.name),
            sortable: true
        },
        {
            name: 'HSN Code',
            selector: (row) => row?.hsnCode,
            sortable: true
        },
        {
            name: 'Price',
            selector: (row) => row?.product?.map((data) => data?.price),
            sortable: true
        },
        {
            name: 'Action',
            selector: (row) => {
                return (
                    <div>
                        <i
                            onClick={() => {
                                dispatch(commonModalIsOpen(true));
                                dispatch(commonModalType('EDIT_PRODUCT'));
                                setRowData(row);
                            }}
                            className="icon feather icon-edit f-22 text-c-blue mr-3"
                            role="button"
                            aria-hidden="true"
                        />

                        <i
                            onClick={() => {
                                dispatch(commonDeleteModal(true));
                                setRowData(row);
                            }}
                            className="icon feather icon-trash-2 f-22 text-c-red"
                            role="button"
                            aria-hidden="true"
                        />
                    </div>
                );
            }
        }
    ];

    const { getAllProducts, updateData, deleteData, createData } = useSelector((state) => state.productsReducer);
    const [rowData, setRowData] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsApi());
    }, [updateData, deleteData, createData]);

    return (
        <div>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title className="m-0 font-weight-bold">All Products</Card.Title>
                    <Button
                        onClick={() => {
                            dispatch(commonModalIsOpen(true));
                            dispatch(commonModalType('ADD'));
                        }}
                        size="sm"
                        className="d-flex align-items-center p-2"
                    >
                        <i className="feather icon-plus f-20" />
                        <div>New Product</div>
                    </Button>
                </Card.Header>
                <Card.Body>
                    <CommonDataTable columns={columns} data={getAllProducts} />
                </Card.Body>
            </Card>
            <ProductsModal data={rowData} />
            <DeleteConfModal del_id={rowData?._id} type={'PRODUCTS'} title={rowData?.product} />
        </div>
    );
};
export default Products;
