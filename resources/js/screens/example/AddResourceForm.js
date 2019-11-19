import React from 'react'
import { Modal, Form, Input, Radio } from 'antd';
import 'antd/lib/style/index.css';
import 'antd/lib/modal/style/index.css';
import 'antd/lib/button/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/input/style/index.css'

const FormItem = Form.Item;

const AddResourceForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新規ユーザーを追加"
        okText="追加"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '名前は必須入力項目です！' }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

export default AddResourceForm
