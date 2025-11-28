import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
    Appbar,
    Chip,
    Icon,
    Searchbar,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { showBorder } from "./common.js"

// TODO: 어느정도되면 Map, FacilityList 컴포넌트 분리, 각각 상태 가져가서 그에 따라 display설정하는 것 잊지말고


