import React from 'react'
import { View, ScrollView } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper'
import { useForm } from '@tanstack/react-form'
import { useNavigation } from '@react-navigation/native'
import { LoginInfoContext } from '../../Context'
import apis from '../../apis'
import GoBackHeader from '../FacilityDetailPage/GoBackHeader'

export default function CreateCommunityScreen() {
  const navigation = useNavigation()
  const { loginInfo } = React.useContext(LoginInfoContext)

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch(`${apis.urls.server}/community`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginInfo.token}`,
          },
          body: JSON.stringify({
            title: value.title,
            content: value.content,
          }),
        })
        const json = await res.json();
        console.log(json);

        navigation.goBack();
      } catch (e) {
        console.error('submit error', e)
      } finally {

      }
    },
  })

  return (
    <>
      <GoBackHeader title="커뮤니티 글 작성" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 제목 */}
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value ? '제목은 필수 입력임' : undefined,
          }}
        >
          {(field) => (
            <>
              <Text style={{ fontWeight: '700', marginBottom: 4 }}>제목</Text>
              <TextInput
                mode="outlined"
                value={field.state.value}
                onChangeText={(v) => field.handleChange(v)}
                onBlur={field.handleBlur}
                error={!!field.state.meta.error}
              />
              {field.state.meta.error && (
                <Text style={{ color: 'red', marginTop: 4 }}>
                  {field.state.meta.error}
                </Text>
              )}
            </>
          )}
        </form.Field>

        <View style={{ height: 24 }} />

        {/* 내용 */}
        <form.Field
          name="content"
          validators={{
            onChange: ({ value }) =>
              !value ? '내용은 필수 입력임' : undefined,
          }}
        >
          {(field) => (
            <>
              <Text style={{ fontWeight: '700', marginBottom: 4 }}>내용</Text>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={6}
                value={field.state.value}
                onChangeText={(v) => field.handleChange(v)}
                onBlur={field.handleBlur}
                error={!!field.state.meta.error}
                style={{ minHeight: 150 }}
              />
              {field.state.meta.error && (
                <Text style={{ color: 'red', marginTop: 4 }}>
                  {field.state.meta.error}
                </Text>
              )}
            </>
          )}
        </form.Field>

        <View style={{ height: 32 }} />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              mode="contained"
              disabled={!canSubmit}
              loading={isSubmitting}
              onPress={() => form.handleSubmit()}
            >
              등록
            </Button>
          )}
        </form.Subscribe>
      </ScrollView>
    </>
  )
}