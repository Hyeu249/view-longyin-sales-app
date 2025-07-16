import React, { useState, useEffect } from "react";
import FieldsForm from "@/components/FieldsForm";
import { useForm } from "react-hook-form";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Text, View } from "react-native";
import { MainField } from "@/utils/type";
import { Controller, FieldError, FieldErrors, Control } from "react-hook-form";
import BottomButtons from "@/components/BottomButtons";
import WorkflowButton from "@/components/WorkflowButton";
import SubmitButton from "@/components/SubmitButton";

type Props = {
  fields: MainField[];
  onCancel: () => void;
  onSave: () => void;
  control: Control<any>;
  errors: FieldErrors;
  isSubmitForm?: boolean;
  isWorkflowForm?: boolean;
  doctype: string;
  id?: string;
};

export default function DocForm({
  fields,
  onCancel,
  onSave,
  control,
  errors,
  isSubmitForm,
  isWorkflowForm,
  doctype,
  id,
}: Props) {
  const [isAllowSave, setIsAllowSave] = useState(true);

  useEffect(() => {
    if (isSubmitForm || isWorkflowForm) setIsAllowSave(false);
  }, [isSubmitForm, isWorkflowForm]);

  const button = () => {
    const button1 = <BottomButtons onCancel={onCancel} onSave={onSave} />;
    const button2 = <SubmitButton doctype={doctype || ""} id={id || ""} />;
    const button3 = <WorkflowButton doctype={doctype || ""} id={id || ""} />;

    if (isAllowSave) {
      return button1;
    } else if (isWorkflowForm) {
      return button3;
    } else if (isSubmitForm) {
      return button2;
    } else {
      return button1;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FieldsForm
        fields={fields}
        errors={errors}
        control={control}
        setIsAllowSave={setIsAllowSave}
        doctype={doctype}
        id={id}
      />
      {button()}
    </View>
  );
}
