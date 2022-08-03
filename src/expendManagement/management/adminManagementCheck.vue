<template>
  <div class="adminManagementCheck flex-column">
    <YfDetailsHeader :path="'/expendManagement/adminManagement'+this.info.hash" :title="info.title"></YfDetailsHeader>
    <div class="header flex-vCenter">
      <i class="yfFont icon-biaotiqian"></i>
      <span>项目详情</span>
    </div>
    <div class="container">
      <div class="detailsContent">
        <!-- 项目立项 -->
        <YfCollapse title="项目立项管理" :isShow="info.title === '审核项目立项' ? true : false" ref="collapse1">
          <div class="projectSetUp">
            <el-form :model="proSetUpForm" :rules="rules" ref="ruleForm"  label-width="110px" label-position="left" class="demo-ruleForm">
              <p>
                <el-form-item label="所属场站：">
                  <el-select v-model="proSetUpForm.proSetUpPlant" placeholder="请选择" :disabled="info.isOff">
                    <el-option v-for="(item, index) in deptPlantList" :key="index" :label="item.plantName" :value="item.plantId"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="标的名称：">
                  <el-input v-model="proSetUpForm.proSetUpActivityName" :disabled="info.isOff"></el-input>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="项目类型：">
                  <el-select v-model="proSetUpForm.proSetUpProjectType" placeholder="请选择项目类型" :disabled="info.isOff">
                    <el-option v-for="(item, index) in ProjectType" :key="index" :label="item.projectTypeName" :value="item.projectType"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="预算科目：">
                  <el-select v-model="proSetUpForm.proSetUpBudgetCode" placeholder="请选择预算科目" :disabled="info.isOff">
                    <el-option v-for="(item, index) in budgetCodeList" :key="index" :label="item.budgetCodeName" :value="item.budgetCode"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="预算金额： ">
                  <el-input v-model.number="proSetUpForm.proSetUpMoney" :disabled="info.isOff" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')">
                    <span slot="suffix" style="marginRight: 10px;">元</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="预算检查： ">
                  <el-tooltip class="item" effect="light" placement="top-start">
                    <div slot="content" class="tooltip">
                      <p>场站的可用投资预算（元）:</p>
                      <h4>￥{{proSetUpForm.plantResidue}}</h4>
                      <p>项目公司的可用投资预算（元）:</p>
                      <h4>￥{{proSetUpForm.totalResidue}}</h4>
                    </div>
                    <span :style="{color: proSetUpForm.proSetUpCheck? 'red': 'green'}">{{proSetUpForm.proSetUpCheck? '超预算': '未超预算'}}</span>
                  </el-tooltip>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="计划采购时间： ">
                  <el-date-picker
                    v-model="proSetUpForm.proSetUpTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="info.isOff">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="采购方式：">
                  <el-select v-model="proSetUpForm.proSetUpPurchasingMethod" placeholder="请选择采购方式" :disabled="info.isOff">
                    <el-option v-for="(item, index) in purchasingMethod" :key="index" :label="item.purchasingMethodName" :value="item.purchasingMethod"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="立项支撑文件：">
                  <div class="uploadList" v-if="approvalList && approvalList.length > 0">
                    <ul>
                      <li v-for="(item, index) in approvalList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span class="yfFont icon-xiazai" @click="download(item)"></span> 
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p v-if="info.isEstablishOff">
                <el-form-item label="统一采购项目:">
                  <el-table
                    :data="purchaseTableData"
                    border
                    :span-method="arraySpanMethod2"
                    style="width: 100%">
                    <el-table-column
                      label="序号"
                      width="60">
                      <template slot-scope="scope">
                        <div :class="setBlue(scope.row)" @click="increasePurchase(scope.row)"><i class="el-icon-plus" v-if="scope.row.serialNumber === '添加统一采购项目'" style="marginRight: 5px"></i>{{scope.row.serialNumber}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="plantName"
                      label="场站"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="tenderName"
                      label="标的名称"
                      width="300"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                      prop="projectTypeName"
                      label="项目类型">
                    </el-table-column>
                    <el-table-column
                      prop="budgetCodeName"
                      label="预算科目">
                    </el-table-column>
                    <el-table-column
                      prop="budget"
                      label="预算金额（元）">
                      <template slot-scope="scope">
                        <div v-format="'#,##0.####'">{{scope.row.budget}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="planPurchasingTime"
                      label="计划采购时间">
                      <template slot-scope="scope">
                        <div>{{$moment(scope.row.planPurchasingTime).format('yyyy-MM-DD')}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="purchasingMethodName"
                      label="采购方式">
                    </el-table-column>
                    <el-table-column
                      prop="operation"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <div class="blueTextBtn" @click="purchaseRemove(scope.row)">移除</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
            </el-form>
            <div class="btns" v-if="info.centralizedPurchasing && purchaseAuth">
              <el-button plain @click="cencel()">取消</el-button>
              <el-button type="primary" @click="changeSave()">保存</el-button>
            </div>
            <!-- 添加统一采购项目 -->
            <el-dialog
              title="统一采购项目"
              :visible.sync="purchaseDialog"
              ref="multipleTable"
              width="70%">
              <el-table
                ref="multipleTable"
                :data="purchaseData"
                border
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="40">
                </el-table-column>
                <el-table-column
                  prop="serialNumber"
                  label="序号"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="plantName"
                  label="场站">
                </el-table-column>
                <el-table-column
                  prop="tenderName"
                  label="标的名称"
                  width="300"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="projectTypeName"
                  label="项目类型">
                </el-table-column>
                <el-table-column
                  prop="budgetCodeName"
                  label="预算科目">
                </el-table-column>
                <el-table-column
                  prop="budget"
                  label="预算金额（元）">
                  <template slot-scope="scope">
                    <div v-format="'#,##0.####'">{{scope.row.budget}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="planPurchasingTime"
                  label="计划采购时间">
                  <template slot-scope="scope">
                    <div>{{$moment(scope.row.planPurchasingTime).format('yyyy-MM-DD')}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="purchasingMethodName"
                  label="采购方式">
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer flex-center">
                <el-button @click="purchaseDialog = false">取 消</el-button>
                <el-button type="primary" @click="pitchOn()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </YfCollapse>
        <!-- 编制采购文件, 合同拟稿 -->
        <YfCollapse title="项目采购管理" v-if="info.title === '审核项目立项' ? false : true" :isShow="['审核采购文件', '审核合同拟稿'].includes(info.title) ? true : false" ref="collapse2">
          <div v-if="info.perfect" slot="status" class="contractStatus">
            <i class="el-icon-warning"></i>
            <span>合同信息未录入</span>
          </div>
          <div class="purchase">
            <el-form ref="ruleForm" label-width="110px" label-position="left" class="demo-ruleForm">
              <p class="uploading">
                <el-form-item label="采购文件：">
                  <div class="uploadList" v-if="purchaseList && purchaseList.length > 0">
                    <ul>
                      <li v-for="(item, index) in purchaseList" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="SAP立项资料：">
                  <div class="uploadList" v-if="SAPList && SAPList.length > 0">
                    <ul>
                      <li v-for="(item, index) in SAPList" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
          <div class="draft" v-if="info.title === '审核采购文件' ? false : true">
            <el-form :model="draftForm" :rules="rules" ref="ruleForm" label-width="110px" label-position="left" class="demo-ruleForm">
              <p>
                <el-form-item label="合同总价：">
                  <el-input :value="formatText(draftForm.contractAmount)" :disabled="info.isOff"></el-input>
                </el-form-item>
                <el-form-item label="税率：">
                  <el-input v-model="draftForm.rate" :disabled="info.isOff"></el-input>
                </el-form-item>
                <el-form-item label="净价：">
                  <span>￥</span>
                  <span v-format="'#,##0.####'">{{draftForm.netPrice}}</span>
                  <span>元</span>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="合同拟稿：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '合同拟稿')}" 
                    :file-list="draftList"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger"  @click="selectFile('合同拟稿')" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>合同拟稿</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="draftList && draftList.length > 0">
                    <ul>
                      <li v-for="(item, index) in draftList" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
            <el-form v-if="info.perfect" :model="perfectForm" :rules="rules" ref="ruleForm" label-width="110px" label-position="left" class="demo-ruleForm dashed">
              <p>
                <el-form-item label="采购纪要文号：">
                  <el-input v-model="perfectForm.purchaseSummaryNo" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="采购订单：">
                  <el-input v-model="perfectForm.purchaseOrder" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="是否挂网：">
                  <el-radio-group v-model="perfectForm.hangingFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="采购方案纪要：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '采购方案纪要')}" 
                    :file-list="summaryList"
                    :auto-upload="false"
                    :show-file-list="false">
                    <el-button slot="trigger"  v-for="(item, index) in contractListBtns1" :key="index"  @click="selectFile(item)" ><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="summaryList && summaryList.length > 0">
                    <ul>
                      <li v-for="(item, index) in summaryList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'contractListBtns1')}`,`bgColor${findTagColor(item, 'contractListBtns1')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span @click="fileDel(item, summaryList)"><i class="el-icon-close"></i></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="定标价格:">
                  <el-input v-model="perfectForm.targetAmount" placeholder="请输入" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
                </el-form-item>
                <el-form-item label="定标纪要文号：">
                  <el-input v-model="perfectForm.targetSummaryNo" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="定标纪要：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '定标纪要')}" 
                    :file-list="summaryList1"
                    :auto-upload="false"
                    :show-file-list="false">
                    <el-button slot="trigger"  v-for="(item, index) in contractListBtns2" :key="index"  @click="selectFile(item)" ><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="summaryList1 && summaryList1.length > 0">
                    <ul>
                      <li v-for="(item, index) in summaryList1" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'contractListBtns2')}`,`bgColor${findTagColor(item, 'contractListBtns2')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span @click="fileDel(item, summaryList1)"><i class="el-icon-close"></i></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="合同谈判纪要：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '合同谈判纪要')}" 
                    :file-list="summaryList2"
                    :auto-upload="false"
                    :show-file-list="false">
                    <el-button slot="trigger"  v-for="(item, index) in contractListBtns3" :key="index"  @click="selectFile(item)" ><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="summaryList2 && summaryList2.length > 0">
                    <ul>
                      <li v-for="(item, index) in summaryList2" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'contractListBtns3')}`,`bgColor${findTagColor(item, 'contractListBtns3')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span @click="fileDel(item, summaryList2)"><i class="el-icon-close"></i></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="完成法务日期:">
                  <el-date-picker
                    v-model="perfectForm.legalDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="合同编号：">
                  <el-input v-model="perfectForm.contractNo" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="合同名称：" style="flex: 2;">
                  <el-input v-model="perfectForm.contractName" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="合同签订单位：">
                  <el-input v-model="perfectForm.contractSigningOrg" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="合同签订时间：">
                  <el-date-picker
                    v-model="perfectForm.contractSigningTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="合同生效日期：">
                  <el-date-picker
                    v-model="perfectForm.contractEffectiveDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="合同联系人：">
                  <el-input v-model="perfectForm.contractContact" placeholder="请输入" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="是否追加计划：">
                  <el-radio-group v-model="perfectForm.additionalPlanFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="正式版合同：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '正式版合同')}" 
                    :file-list="summaryList3"
                    :auto-upload="false"
                    :show-file-list="false">
                    <el-button slot="trigger"  v-for="(item, index) in contractListBtns4" :key="index"  @click="selectFile(item)" ><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="summaryList3 && summaryList3.length > 0">
                    <ul>
                      <li v-for="(item, index) in summaryList3" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'contractListBtns4')}`,`bgColor${findTagColor(item, 'contractListBtns4')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span @click="fileDel(item, summaryList3)"><i class="el-icon-close"></i></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
            <div class="btns" v-if="info.perfect">
              <el-button plain>取消</el-button>
              <el-button type="primary" @click="perfectSave()">保存</el-button>
            </div>
          </div>
        </YfCollapse>
        <!-- 项目实施 -->
        <YfCollapse title="项目实施管理" v-if="['审核项目立项', '审核采购文件', '审核合同拟稿'].includes(info.title) ? false : true" :isShow="info.title === '审核项目实施' ? true : false" ref="collapse3">
          <div class="implementation">
            <el-form :rules="rules" ref="ruleForm" label-width="110px" label-position="left" class="demo-ruleForm">
              <p class="uploading">
                <el-form-item label="到货验收：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施1')}" 
                    :file-list="implementationList1"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns1" :key="index" @click="selectFile(item)" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList1 && implementationList1.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList1" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="实物照片：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施图片1')}" 
                    :file-list="implementationImageList1"
                    :auto-upload="false"
                    :disabled="info.isOff">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="三措两案：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施2')}" 
                    :file-list="implementationList2"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger"  @click="selectFile('三措两案')" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>三措两案</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList2 && implementationList2.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList2" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="外包入场审查：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施3')}" 
                    :file-list="implementationList3"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger"  @click="selectFile('外包入场审查')" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>外包入场审查</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList3 && implementationList3.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList3" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="开工报告：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施4')}" 
                    :file-list="implementationList4"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger"  @click="selectFile('开工报告')" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>开工报告</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList4 && implementationList4.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList4" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="关联督办单:">
                  <div>
                    <el-table
                      :data="superviseTableData"
                      border
                      style="width: 100%;maxWidth: 1260px;">
                      <el-table-column
                        prop="name"
                        label="序号"
                        width="80">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单编号"
                        width="120">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单类型"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单类别"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="场站名称"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="设备名称"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="address"
                        label="工作内容">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="计划开工时间/故障发生时间"
                        width="120">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="负责人"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="督办单状态"
                        width="120">
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                          <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="过程监督：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施5')}" 
                    :file-list="implementationList5"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns2" :key="index" @click="selectFile(item)" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item}}</el-button>
                    <el-button v-show="!info.isOff" @click="addFileListBtn()" style="marginLeft: 10px;"><i class="el-icon-plus" style="marginRight:10px;"></i>其他</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList5 && implementationList5.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList5" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="验收：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施6')}" 
                    :file-list="implementationList6"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger" v-for="(item, index) in implementationBtns3" :key="index" @click="selectFile(item)" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList6 && implementationList6.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList6" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="实物照片：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview2"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施图片2')}" 
                    :file-list="implementationImageList2"
                    :auto-upload="false"
                    :disabled="info.isOff">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible2">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="完工总结：">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '项目实施7')}" 
                    :file-list="implementationList7"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.isOff">
                    <el-button slot="trigger"  @click="selectFile('完工总结')" v-show="!info.isOff"><i class="el-icon-plus" style="marginRight:10px;"></i>完工总结</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="implementationList7 && implementationList7.length > 0">
                    <ul>
                      <li v-for="(item, index) in implementationList7" :key="`file${index}`">
                        <span>
                          <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
        </YfCollapse>
        <!-- 入账计划 -->
        <YfCollapse title="投资预算管理" v-if="['审核项目立项', '审核采购文件', '审核合同拟稿'].includes(info.title) ? false : true" :isShow="info.title === '审核入账计划' ? true : false" ref="collapse4">
          <div class="income">
            <el-form :model="incomeForm" :rules="rules" ref="ruleForm" label-width="110px" label-position="left" class="demo-ruleForm">
              <p>
                <el-form-item label="合同总价：">
                  <el-input :value="formatText(incomeForm.contractTotal)" :disabled="info.isOff"></el-input>
                </el-form-item>
                <el-form-item label="税率：">
                  <el-input v-model="incomeForm.rate" :disabled="info.isOff"></el-input>
                </el-form-item>
                <el-form-item label="净价：">
                  <span>￥</span>
                  <span v-format="'#,##0.####'">{{incomeForm.netPrice}}</span>
                  <span>元</span>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="入账是否含税：">
                  <el-radio-group v-model="incomeForm.rateFlag" :disabled="info.isOff">
                    <el-radio :label="true">含税</el-radio>
                    <el-radio :label="false">不含税</el-radio>
                  </el-radio-group>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="年度入账计划：">
                  <el-table
                    :data="incomeTableData"
                    border
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="year"
                      label="年度"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="计划审核状态"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.isPass" v-if="scope.row.status !== 4" :disabled="info.billReadonly">
                          <el-radio :label="true">通过</el-radio>
                          <el-radio :label="false">不通过</el-radio>
                        </el-radio-group>
                        <div v-else>--</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="入账明细列表：">
                  <el-table
                    :data="inDetailData"
                    border
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="month"
                      label="月份"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="fileCount"
                      label="入账材料"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="审核状态"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="actualAmount"
                      label="实际入账金额（元）"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="count"
                      label="入账次数"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="operation"
                      label="操作"
                      width="120">
                      <template slot-scope="scope">
                        <div class="blueTextBtn" @click="inFunctionality(scope.row)">查看</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="累计入账金额：">
                  <span>￥</span>
                  <span>{{incomeForm.amountSum}}</span>
                  <span>元</span>
                </el-form-item>
                <el-form-item label="累计入账比例：">
                  <span>{{incomeForm.amountSumRatio}}%</span>
                </el-form-item>
              </p>
            </el-form>
          </div>
        </YfCollapse>
        <!-- 付款计划 -->
        <YfCollapse title="资金预算管理" v-if="['审核项目立项', '审核采购文件', '审核合同拟稿'].includes(info.title) ? false : true" :isShow="info.title === '审核付款计划' ? true : false" ref="collapse5">
          <div class="outcome">
            <el-form :model="outcomeForm" :rules="rules" ref="ruleForm" label-width="110px" label-position="left" class="demo-ruleForm">
              <p>
                <el-form-item label="质保金：">
                  <el-input v-model="outcomeForm.qualityGuaranteeMoney" :disabled="info.isOff"></el-input>
                </el-form-item>
                <el-form-item label="质保期：">
                  <el-input v-model="outcomeForm.qualityGuarantee" :disabled="info.isOff"></el-input>
                </el-form-item>
                <el-form-item>
                  <!-- 占位 -->
                </el-form-item>
              </p>
              <p>
                <el-form-item label="出质保日期：">
                  <el-date-picker type="date" v-model="outcomeForm.qualityGuaranteeOutDate" style="width: 100%;" :disabled="info.isOff"></el-date-picker>
                </el-form-item>
                <el-form-item>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="年度付款计划：">
                  <el-table
                    :data="paymentData"
                    border
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="dataDate"
                      label="年度"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="计划审核状态"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="operation"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.isPass" v-if="scope.row.status !== 4" :disabled="info.payReadonly">
                          <el-radio :label="true">通过</el-radio>
                          <el-radio :label="false">不通过</el-radio>
                        </el-radio-group>
                        <div v-else>--</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="付款明细列表：">
                  <el-table
                    :data="outDetailData"
                    border
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                    <el-table-column
                      prop="serialNumber"
                      label="序号"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="month"
                      label="月份"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="planAmount"
                      label="计划入账金额（元）"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="comment"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="fileCount"
                      label="入账材料"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="statusName"
                      label="审核状态"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="actualAmount"
                      label="实际入账金额（元）"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="count"
                      label="入账次数"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="operation"
                      label="操作"
                      width="120">
                      <template>
                        <div class="blueTextBtn" @click="outFunctionality()">查看</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="累计付款金额：">
                  <span>￥</span>
                  <span>{{outcomeForm.amountSum}}</span>
                  <span>元</span>
                </el-form-item>
                <el-form-item label="累计付款比例：">
                  <span>{{outcomeForm.amountSumRatio}}%</span>
                </el-form-item>
              </p>
            </el-form>
            <!-- 新增年度付款计划弹窗 -->
            <el-dialog
              title="年度付款计划"
              :visible.sync="paymentDialog"
              width="30%">
              <div class="increaseContent">
                <el-form ref="comeform" :model="comeform" label-width="120px">
                  <el-form-item label="计划付款年度：">
                    <el-col :span="22">
                      <el-date-picker
                        v-model="comeform.year"
                        type="year"
                        placeholder="选择年"
                        style="width: 100%;">
                      </el-date-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="计划付款金额：">
                    <el-col :span="22">
                      <el-input v-model="comeform.money"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="备注：">
                    <el-col :span="22">
                      <el-input v-model="comeform.remark"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="预算检查：">
                    <span>{{comeform.check}}</span>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="paymentDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('paymentData', 'comeform')">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </YfCollapse>
        <!-- 完工总结 -->
        <YfCollapse title="完工总结" v-if="['审核项目立项', '审核采购文件', '审核合同拟稿', '审核项目实施', '审核入账计划', '审核付款计划'].includes(info.title) ? false : true" :isShow="info.title === '审核完工总结' ? true : false" ref="collapse6">
          <div class="comment">
            <el-form label-width="110px" label-position="left" >
              <p>
                <el-form-item label="评价报告：">
                  <el-input
                    type="textarea"
                    :rows="2"
                    resize='none'
                    v-model="endForm.evaluate"
                    :disabled="info.isOff">
                  </el-input>
                  <span class="uploading">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :on-change="(file, fileList) => {return handleChange(file, fileList, '项目评价报告')}" 
                      :file-list="commentList"
                      :auto-upload="false"
                      :show-file-list="false"
                      v-if="!info.isOff">
                      <el-button slot="trigger" v-for="(item, index) in commentBtns" :key="index" v-show="!info.isOff" @click="selectFile(item)"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item}}</el-button>
                      <el-button v-show="!info.isOff" @click="addFileListBtn()" style="marginLeft: 10px;"><i class="el-icon-plus" style="marginRight:10px;"></i>其他</el-button>
                    </el-upload>
                    <div class="uploadList" v-if="commentList && commentList.length > 0">
                      <ul>
                        <li v-for="(item, index) in commentList" :key="`file${index}`">
                          <span>
                            <span  :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                          </span>
                          <span>{{item.fileName}}</span>
                          <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                          <span  class="yfFont icon-xiazai" @click="download(item)"></span>
                        </li>
                      </ul>
                    </div>
                  </span>
                </el-form-item>
              </p>
            </el-form>
          </div>
        </YfCollapse>
        <!-- 供应商评价 -->
        <YfCollapse title="供应商评价" v-if="['审核项目立项', '审核采购文件', '审核合同拟稿', '审核项目实施', '审核入账计划', '审核付款计划', '审核完工总结'].includes(info.title) ? false : true" :isShow="info.title === '审核供应商评价' ? true : false" ref="collapse7">
          <div class="comment">
            <el-form ref="supplierForm" :model="supplierForm" label-width="110px" label-position="left" >
              <p>
                <el-form-item label="对供应商评价：" class="rate">
                  <div><h5>{{supplierForm.supplierName}}</h5></div>
                  <div>
                    <span>企业资质条件：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num1" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isOff"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <span>质量保证能力：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num2" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isOff"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <span>配合度：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num3" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isOff"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <span>交付及时性：</span>
                    <span>
                      <el-input-number v-model="supplierForm.num4" :min="1" :max="5" label="描述文字" size="small" :disabled="info.isOff"></el-input-number>
                    </span>
                  </div>
                  <div>
                    <el-input
                      type="textarea"
                      :rows="2"
                      resize='none'
                      placeholder="请输入内容"
                      v-model="supplierForm.supplier"
                      :disabled="info.isOff">
                    </el-input>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
        </YfCollapse>
        <!-- 审核结果 -->
        <div class="auditOpinion" v-if="!info.centralizedPurchasing && (info.billReadonly && info.payReadonly) && !info.readnoly">
          <el-form ref="auditForm" :model="auditForm" label-width="120px" > 
            <el-form-item label="审核结果：" v-if="['审核项目立项', '审核采购文件', '审核合同拟稿', '审核项目实施', '审核项目后评价', '审核完工总结', '审核供应商评价'].includes(info.title)">
              <el-radio-group v-model="auditForm.pass">
                <el-radio :label="true">通过</el-radio>
                <el-radio :label="false">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="意见及建议：">
            <el-input
              type="textarea"
              :rows="2"
              resize='none'
              placeholder="请输入内容"
              v-model="auditForm.suggest"
              maxlength="200">
            </el-input>
            </el-form-item>
          </el-form>
          <!-- 提交按钮 -->
          <div class="btns" v-if="!info.centralizedPurchasing">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button type="primary" @click="submitAudit()">提交</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 流转过程 -->
    <div class="process">
      <YfCollapse title="流转过程" ref="collapse8" :isShow="false">
        <div class="statusWrap flex-center" slot="status">
          <span class="name">当前状态：</span>
          <span :class="[`color${getStatusId(projectEdit.projectStatus)}`,`bgColor${getStatusId(projectEdit.projectStatus)}`,`brColor${getStatusId(projectEdit.projectStatus)}`]">{{getStatusName(projectEdit.projectStatus)}}</span>
        </div>
        <timelineForm :activities="activities"></timelineForm>
      </YfCollapse>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import timelineForm from '@/views/expendManagement/timelineForm.vue'
export default {
  data() {
    return { 
      activities: [],
      baseFormData: {},
      info: {}, //用于接收
      projectInfo: {},
      investment: {},
      funds: {},
      files: {},
      tag:'', //上传文件的类型打上标签
      code: '',
      approvalList: [],//项目立项页面的上传列表
      purchaseList: [],
      SAPList: [],        //采购页面的上传列表
      draftList: [],      //合同拟稿页面的上传列表
      summaryList: [],    //完善合同页面的上传列表npm 
      summaryList1: [],
      summaryList2: [],
      summaryList3: [],
      implementationList1: [],  //项目实施页面的上传列表
      implementationList2: [],
      implementationList3: [],
      implementationList4: [],
      implementationList5: [],
      implementationList6: [],
      implementationList7: [],
      implementationImageList1: [], //项目实施页面的图片上传列表
      implementationImageList2: [],
      dialogImageUrl: '',     
      dialogVisible: false,   //项目实施页面的图片展示弹窗
      dialogVisible2: false,
      commentList: [],
      contractListBtns1: [],
      contractListBtns2: [],
      contractListBtns3: [],
      contractListBtns4: [],
      approvalBtns: ['可行性研究报告', '资本性支出申报表', '科技项目申请书', '科技项目预算书', '众创项目申报表'],  //项目立项上传按钮
      purchaseListBtns: ['询价、招标文件', '采购全过程规范管理文件', '计费清单', '技术规范书'],  //编制采购文件上传按钮
      implementationBtns1: ['验收单'], //项目立项上传按钮
      implementationBtns2: ['过程监督'],
      implementationBtns3: ['验收'],
      commentBtns: ['项目评价报告'],   //完工总结上传按钮
      proSetUpForm: { //项目立项表单
        proSetUpPlant: '',
        proSetUpActivityName: '',
        proSetUpProjectType: '',
        proSetUpBudgetCode: '',
        proSetUpMoney: '',
        proSetUpCheck: false,
        proSetUpTime: '',
        proSetUpPurchasingMethod: '',
        plantResidue: '0',
        totalResidue: '0',
      },
      deptPlantList: [],
      ProjectType: [],
      budgetCodeList: [],
      purchasingMethod: [],
      projectEdit: {},
      draftForm: {}, //合同拟稿表单
      perfectForm: {  //完善合同表单
        additionalPlanFlag: true,
        contractContact: "",
        contractEffectiveDate: "",
        contractName: "",
        contractNo: "",
        contractSigningOrg: "",
        contractSigningTime: "",
        hangingFlag: true,
        legalDate: "",
        projectId: 0,
        purchaseOrder: "",
        purchaseStatus: 0,
        purchaseSummaryNo: "",
        targetAmount: 0,
        targetSummaryNo: ""
      },
      incomeForm: {}, //入账计划表单
      outcomeForm: {},  //付款计划表单
      increaseDialog: false,  //新增入账计划弹窗
      paymentDialog: false,   //新增付款计划弹窗
      purchaseDialog: false,  //添加统一采购项目弹窗
      enterform: { //新增入账计划弹窗表单
        year: '',
        money: '',
        remark: '',
        check: '未超预算'
      },
      comeform: { //新增付款计划弹窗表单
        year: '',
        money: '',
        remark: '',
        check: '未超预算'
      },
      endForm: {},  //完工总结表单
      supplierForm: {
        supplierName: '',
        supplier: '',
        num1: 5,
        num2: 5,
        num3: 5,
        num4: 5,
      },
      auditForm: {  //评论意见
        pass: true,
        suggest: '',
      },
      rules: {  //表单校验
        name: [
          { required: true, message: '请输入标的名称：', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        type1: [
          { required: true, message: '请至少选择一种项目类型', trigger: 'change' }
        ],
        type2: [
          { required: true, message: '请至少选择一种预算科目', trigger: 'change' }
        ],
        money: [
          { required: true, message: '预算金额不能为空'},
          { type: 'number', message: '预算金额必须为数字值'}
        ],
        mode: [
          { required: true, message: '请至少选择一种采购方式', trigger: 'change' }
      ]},
      tagMapColor: [], //tag颜色映射表
      superviseTableData: [{  //项目实施中督办单表格
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      incomeTableData: [],//入账计划表格
      inDetailData:[],
      paymentData: [], //付款计划
      outDetailData:[],//付款明细表格
      tableSelectRow: [], //统一采购被选中得数据
      purchaseTableData: [{ //统一采购项目表格
        serialNumber: '添加统一采购项目',
      }],
      purchaseData: [],
      purchaseAuth: true
    }
  },
  computed: {
    findTagColor () {
      return function (val, btns) {
        const item = this[btns].find(row => row.value === val.tag)
        return item.id%10 < 7 ? item.id%10 + 1 : 1
      }
    }, 
    formatText () {
      return function (row) {
        return this.textFormat(parseFloat(row), '#,##0.####');
      }
    },
    getStatusName () {
      return function (params) {
        if (params === 1) {
          return '待审核'
        }else if (params === 2) {
          return '审核中'
        }else if (params === 3) {
          return '审核不通过'
        }else {
          return '审核通过'
        }
      }
    },
    getStatusId () {
      return function (params) {
        if (params === 1) {
          return 3
        }else if (params === 2) {
          return 4
        }else if (params === 3) {
          return 1
        }else {
          return 5
        }
      }
    },
    ...mapGetters(['storage'])
  },
  created () {
    this.init()
  },
  mounted() {

  },
  methods: {
    async init () {
      this.info = this.storage.adminManagement_details
      this.projectInfo = this.storage.adminManagementCheck_details
      this.projectEdit = this.storage.adminManagementCheck_details.project
      this.investment = this.storage.adminManagementCheck_details?.investment
      this.funds = this.storage.adminManagementCheck_details?.funds
      this.files = this.storage.adminManagementCheck_details?.files
      // 审核项目立项数据渲染 规则
      this.deptPlantList = this.info.deptPlantList
      this.ProjectType = this.info.ProjectType
      this.budgetCodeList = this.info.budgetCodeList
      this.purchasingMethod = this.info.purchasingMethod
      this.proSetUpForm.proSetUpPlant = this.projectEdit.plantId
      this.proSetUpForm.proSetUpActivityName = this.projectEdit.tenderName
      this.proSetUpForm.proSetUpProjectType = this.projectEdit.projectType
      this.proSetUpForm.proSetUpBudgetCode = this.projectEdit.budgetCode
      this.proSetUpForm.proSetUpMoney = this.projectEdit.budget
      this.proSetUpForm.proSetUpCheck = this.projectEdit.budgetCheck
      this.proSetUpForm.proSetUpTime = this.projectEdit.planPurchasingTime
      this.proSetUpForm.proSetUpPurchasingMethod = this.projectEdit.purchasingMethod
      this.activities = this.projectInfo.logs
      this.activities.map((val, index) => {
        val.no = index + 1
      })
      // 上传按钮
      this.contractListBtns1 = [this.info.fileTypeList[2].children[1]] 
      this.contractListBtns2 = [this.info.fileTypeList[2].children[2]]
      this.contractListBtns3 = [this.info.fileTypeList[2].children[3]]
      this.contractListBtns4 = [this.info.fileTypeList[2].children[4]]
      // 立项支撑文件     文件列表信息渲染
      if (this.files[1]) {
        this.approvalList = this.files[1]
      }
      // 编制采购文件
      if (this.files[2]) {
        this.purchaseList = this.files[2].filter(val => {
          return val.fileCode !== 205
        })
        this.SAPList = this.files[2].filter(val => {
          return val.fileCode === 205
        })
      }
      //合同拟稿
      if (this.files[3]) {
        this.draftList = this.files[3].filter(val => {
          return val.fileCode === 300
        })
        this.summaryList = this.files[3].filter(val => {
          return val.fileCode === 301
        })
        this.summaryList1 = this.files[3].filter(val => {
          return val.fileCode === 302
        })
        this.summaryList2 = this.files[3].filter(val => {
          return val.fileCode === 303
        })
        this.summaryList3 = this.files[3].filter(val => {
          return val.fileCode === 304
        })
        this.summaryList.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.summaryList1.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.summaryList2.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
        this.summaryList3.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
      }
      // 项目实施
      let image1, image2
      if (this.files[4]) {
        this.implementationList1 = this.files[4].filter(val => {
          return val.fileCode === 400 || val.fileCode === 401
        })
        this.implementationList2 = this.files[4].filter(val => {
          return val.fileCode === 403
        })
        this.implementationList3 = this.files[4].filter(val => {
          return val.fileCode === 404
        })
        this.implementationList4 = this.files[4].filter(val => {
          return val.fileCode === 405
        })
        this.implementationList5 = this.files[4].filter(val => {
          return val.fileCode === 406 || val.fileCode === 407
        })
        this.implementationList6 = this.files[4].filter(val => {
          return val.fileCode === 408 || val.fileCode === 409
        })
        this.implementationList7 = this.files[4].filter(val => {
          return val.fileCode === 411
        })
        image1 = this.files[4].filter(val => {
          return val.fileCode === 402
        })
        image2 = this.files[4].filter(val => {
          return val.fileCode === 410
        })
      }
      //完工总结
      if (this.files[5]) {
        this.commentList = this.files[5]
      }
      // 预算检查
      this.budgetaryControl()
      // 统一采购 选择栏数据
      this.$http.fetchGet(`/project/getPurchaseList?budgetCode=${this.projectEdit.budgetCode}
      &projectId=${this.projectEdit.projectId}&projectType=${this.projectEdit.projectType}
      &purchasingMethod=${this.projectEdit.purchasingMethod}`).then(res => {
        if (res.code === 0) {
          this.purchaseData = res.data
          this.purchaseData && this.purchaseData.map((item, index) => {  
            item.serialNumber = index + 1
          })
        }
      })
      // 统一采购表格数据
      if (this.projectInfo.purchaseList) { //如果统一采购有数据就展示
        this.projectInfo.purchaseList.map((val, index) => {
          val.serialNumber = index + 1
          if (val.relatedType === 1) {
            this.purchaseAuth = false
          }
        })
        this.purchaseTableData = [{serialNumber: '添加统一采购项目',}, ...this.projectInfo.purchaseList]
      }
      //审核项目立项后要进行的操作
      if (['审核采购文件', '审核合同拟稿', '审核项目实施', '审核入账计划', '审核付款计划', '审核完工总结', '审核供应商评价'].includes(this.info.title)) {
        this.purchaseTableData = [...this.projectInfo.purchaseList]
      }
      // 合同拟稿信息
      if (['审核合同拟稿', '审核项目实施', '审核入账计划', '审核付款计划', '审核完工总结', '审核供应商评价'].includes(this.info.title)) {
        this.draftForm = this.projectInfo.purchase
        this.perfectForm = this.projectInfo.purchase
      }
      // 完善合同信息
      if (['完善合同信息', '审核项目实施', '审核入账计划', '审核付款计划', '审核完工总结', '审核供应商评价'].includes(this.info.title)) {
        // this.perfectForm = this.projectInfo.purchase
      }
      // 项目实施
      if (['审核项目实施', '审核入账计划', '审核付款计划', '审核完工总结', '审核供应商评价'].includes(this.info.title)) {
        if (image1?.length > 0) {
          for (const k in image1) {
            await this.$http.download(`/file/downloadFile?id=${image1[k].id}`).then(res => {
              image1[k].url = window.URL.createObjectURL(res.data); 
              image1[k].name = image1[k].fileName
            })
            this.implementationImageList1.push(image1[k])
          } 
        }
        if (image2?.length > 0) {
          for (const k in image2) {
            await this.$http.download(`/file/downloadFile?id=${image2[k].id}`).then(res => {
              image2[k].url = window.URL.createObjectURL(res.data); 
              image2[k].name = image2[k].fileName
            })
            this.implementationImageList2.push(image2[k])
          } 
        }
        // 刷新页面
        this.$nextTick(() => {
          this.$refs.collapse3.settingDefaultShow()
        })
      }
      if (['审核入账计划', '审核付款计划', '审核完工总结', '审核供应商评价'].includes(this.info.title)) {
        // 合同总价税率等
        this.incomeForm.contractTotal = this.investment?.contractTotal
        this.incomeForm.rate = this.investment?.rate
        this.incomeForm.netPrice = this.investment?.netPrice
        this.incomeForm.rateFlag = this.investment?.rateFlag
        this.incomeForm.amountSum = this.investment?.amountSum
        this.incomeForm.amountSumRatio = this.investment?.amountSumRatio
        // 年度入账计划信息
        this.incomeTableData = this.investment.years
        this.incomeTableData && this.incomeTableData.map((val, index) => {
          val.serialNumber = index + 1
          val.year = this.$moment(val.dataDate).format("yyyy年")
          this.$set(val,'isPass', true)
        })
        // 入账明细表格
        this.inDetailData = this.investment.months
        this.inDetailData && this.inDetailData.map((val, index) => {
          val.serialNumber = index + 1
          val.month = this.$moment(val.dataDate).format("yyyy年MM月")
        })
        //刷新页面
        if (this.info.title === '审核入账计划') {
          this.$nextTick(() => {
            this.$refs.collapse4.settingDefaultShow()
          })
        }
      }
      if (['审核付款计划', '审核完工总结', '审核供应商评价'].includes(this.info.title)) {
        // 质保金等信息
        // this.outcomeForm = this.funds
        this.outcomeForm.qualityGuaranteeMoney = this.funds?.qualityGuaranteeMoney
        this.outcomeForm.qualityGuarantee = this.funds?.qualityGuarantee
        this.outcomeForm.qualityGuaranteeOutDate = this.funds?.qualityGuaranteeOutDate
        this.outcomeForm.amountSum = this.funds?.amountSum
        this.outcomeForm.amountSumRatio = this.funds?.amountSumRatio
        // 年度付款计划信息
        this.paymentData = this.funds?.years
        this.paymentData && this.paymentData.map((val, index) => {
          val.serialNumber = index + 1
          val.year = this.$moment(val.dataDate).format("yyyy年")
          this.$set(val,'isPass', true)
        })
        // 付款明细表格
        this.outDetailData = this.funds?.months
        this.outDetailData && this.outDetailData.map((val, index) => {
          val.serialNumber = index + 1
          val.month = this.$moment(val.dataDate).format("yyyy年MM月")
        })
        //刷新页面
        if (this.info.title === '审核付款计划') {
          this.$nextTick(() => {
            this.$refs.collapse5.settingDefaultShow()
          })
        }
      }
      if (['审核完工总结', '审核供应商评价'].includes(this.info.title)) {
        this.endForm = this.projectInfo.projectDone
      }
      if (['审核供应商评价'].includes(this.info.title)) {
        this.supplierForm.supplierName = this.projectInfo.projectEvaluate.supplierName
        this.supplierForm.num1 = this.projectInfo.projectEvaluate.qualification
        this.supplierForm.num2 = this.projectInfo.projectEvaluate.qualityAssurance
        this.supplierForm.num3 = this.projectInfo.projectEvaluate.cooperate
        this.supplierForm.num4 = this.projectInfo.projectEvaluate.deliverTimeliness
        this.supplierForm.supplier = this.projectInfo.projectEvaluate.evaluate
        this.$nextTick(() => {
          this.$refs.collapse7.settingDefaultShow()
        })
      }
    },
    submitAudit() {
      if (this.info.title === '审核入账计划') {
        this.$http.fetch(`/project/yearPlanAudit`, {
          "auditFlag": this.incomeTableData[0].isPass,
          "comment": this.auditForm.suggest,
          "dataDate": this.incomeTableData[0].dataDate,
          "planId": this.incomeTableData[0].id,
          "projectId": this.incomeTableData[0].projectId,
          "type": 1
        }).then(() => {
          this.$message({
            message: '恭喜你，这是一条成功消息',
            type: 'success'
          });
          this.$router.push(`/expendManagement/adminManagement${this.info.hash}`)
        })
      }else if (this.info.title === '审核付款计划') {
        this.$http.fetch(`/project/yearPlanAudit`, {
          "auditFlag": this.paymentData[0].isPass,
          "comment": this.auditForm.suggest,
          "dataDate": this.paymentData[0].dataDate,
          "planId": this.paymentData[0].id,
          "projectId": this.paymentData[0].projectId,
          "type": 2
        }).then(() => {
          this.$message({
            message: '恭喜你，这是一条成功消息',
            type: 'success'
          });
          this.$router.push(`/expendManagement/adminManagement${this.info.hash}`)
        })
      }else {
        this.$http.fetch(`/project/projectAudit`,{
          auditFlag: this.auditForm.pass,
          comment: this.auditForm.suggest,
          projectId: this.projectEdit.projectId,
          projectProgress: this.projectEdit.projectProgress
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '恭喜你，这是一条成功消息',
              type: 'success'
            });
            this.$router.push(`/expendManagement/adminManagement${this.info.hash}`)
          }
        })
      }
    },
    budgetaryControl () {
      // this.$http.fetchGet(`/budget/budgetCheck?amount=${this.projectEdit.budget}&budgetCode=${this.projectEdit.budgetCode}&date=${this.$moment(this.projectEdit.planPurchasingTime).format('yyyy-01-01')}&plantId=${this.projectEdit.plantId}`).then(res => {
      //   if (res.code === 0) {
      //     if (res.data === 1) {
      //       this.proSetUpForm.proSetUpCheck = true
      //     }else {
      //       this.proSetUpForm.proSetUpCheck = false
      //     }
      //   }
      // })
      // this.$http.fetchGet(`/budget/investmentAvailable?budgetCode=${this.projectEdit.budgetCode}&date=${this.$moment(this.projectEdit.planPurchasingTime).format('yyyy-01-01')}&plantId=${this.projectEdit.plantId}`).then(res => {
      //   if (res.data) {
      //     this.proSetUpForm.plantResidue = res.data.value0
      //     this.proSetUpForm.totalResidue = res.data.value1
      //   }
      // })
    },
    changeSave () {
      this.purchaseTableData.shift()
      const list = this.purchaseTableData.map(val => {
        return val.projectId
      })
      this.$http.fetch(`/project/purchaseList?ids=${list}&projectId=${this.projectEdit.projectId}`).then(() => {
        this.$router.push(`/expendManagement/adminManagement${this.info.hash}`)
      })  
    },
    perfectSave () {
      const formDatas = new FormData();
      const uploadFile = formDatas && this.$http.upload(`/file/uploadFileList?date=${this.$moment().format('yyyy-MM-DD')}&type=3`, formDatas)
      const list = []
      const tatalList = [...this.summaryList, ...this.summaryList1, ...this.summaryList2, ...this.summaryList3]
      tatalList.forEach((val)=>{
        if(val.raw){
          formDatas.append("file", val.raw); 
          list.push({
            fileCode: val.code,
            fileName: val.name,
            fileSize: val.size,
          })
        }      
      });
      Promise.all([uploadFile, this.$http.fetch(`/project/purchaseAuditEdit`, {
        "additionalPlanFlag": this.perfectForm.additionalPlanFlag?this.perfectForm.additionalPlanFlag:undefined,
        "contractContact": this.perfectForm.contractContact?this.perfectForm.contractContact:undefined,
        "contractEffectiveDate": this.perfectForm.contractEffectiveDate?this.$moment(this.perfectForm.contractEffectiveDate).format('yyyy-MM-DD'):undefined,
        "contractName": this.perfectForm.contractName?this.perfectForm.contractName:undefined,
        "contractNo": this.perfectForm.contractNo?this.perfectForm.contractNo:undefined,
        "contractSigningOrg": this.perfectForm.contractSigningOrg?this.perfectForm.contractSigningOrg:undefined,
        "contractSigningTime": this.perfectForm.contractSigningTime?this.$moment(this.perfectForm.contractSigningTime).format('yyyy-MM-DD HH:mm:ss'):undefined,
        // "delFileUri": {
        //   "additionalProp1": "string",
        //   "additionalProp2": "string",
        //   "additionalProp3": "string"
        // }, 
        "hangingFlag": true,
        "legalDate": this.perfectForm.legalDate?this.$moment(this.perfectForm.legalDate).format('yyyy-MM-DD'):undefined,
        "projectId": this.projectInfo.purchase.projectId,
        "purchaseOrder": this.perfectForm.purchaseOrder?this.perfectForm.purchaseOrder:undefined,
        "purchaseStatus": this.projectInfo.purchase.purchaseStatus,
        "purchaseSummaryNo": this.perfectForm.purchaseSummaryNo?this.perfectForm.purchaseSummaryNo:undefined,
        "targetAmount": this.perfectForm.targetAmount?this.perfectForm.targetAmount:undefined,
        "targetSummaryNo": this.perfectForm.targetSummaryNo?this.perfectForm.targetSummaryNo:undefined
      })]).then(result => {
        list.map((val, index) => {
          val.fileUrl = result[0].data[index]
          val.projectId = this.projectInfo.purchase.projectId
        })
        this.$http.fetch(`/file/saveFileList`, list).then(res => {
          if (res.code === 0) {
            this.$router.push(`/expendManagement/adminManagement${this.info.hash}`)
          }
        })
      })
    },
    cencel() {
      this.$router.push(`/expendManagement/adminManagement${this.info.hash}`)
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {  //文件列表移除文件时的钩子
      console.log(file, fileList);
    },
    handlePreview(file) {   //点击文件列表中已上传的文件时的钩子
      console.log(file);
    },
    handleChange (file, fileList, params) { 
      let collapse = null
      if (params === '采购方案纪要') {
        this.summaryList = fileList
        collapse = 'collapse2'
      }else if (params === '定标纪要') {
        this.summaryList1 = fileList
        collapse = 'collapse2'
      }else if (params === '合同谈判纪要') {
        this.summaryList2 = fileList
        collapse = 'collapse2'
      }else if (params === '正式版合同') {
        this.summaryList3 = fileList
        collapse = 'collapse2'
      }
      file.tag = this.tag   //把选中时的tag添加到对象上 
      file.code = this.code   //把选中时的tag添加到对象上 
      file.fileSize = file.size
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs[collapse].settingDefaultShow(true)
      })
      console.log(file, fileList, params);
    },
    selectFile (item) { //选择文件完毕等待上传
      this.tag = item.value   //给文件打上tag，如‘可行性研究报告’
      this.code = item.id  
      console.log(item);
    },
    addFileListBtn () {
      
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview2(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },
    handleClick () {
      
    },
    arraySpanMethod2({ rowIndex, columnIndex }) { //表格合并
      if (['审核项目立项'].includes(this.info.title)) {
        if (rowIndex  === 0) {
          if (columnIndex === 0) {
            return [1, 9];
          } else {
            return [0, 0];
          }
        }
      }else {
        return
      }
    },
    setBlue (row) {
      if (['新增年度入账计划', '新增年度付款计划', '添加统一采购项目'].includes(row.serialNumber)) { //新增入账计划的样式
        return {
          blueTextBtn: true
        }
      }
    },
    increaseIncome (row) { //新增入账
      if (row.serialNumber === '新增年度入账计划' && !this.info.isOff) {
        this.increaseDialog = true
        console.log('新增入账');
      }
    },
    increasePayment (row) { //新增付款
      if (row.serialNumber === '新增年度付款计划' && !this.info.isOff) {
        this.paymentDialog = true
        console.log('新增付款');
      }
    },
    increasePurchase (row) { 
      // purchaseAuth被关联项目-无采购权限
      if (row.serialNumber === '添加统一采购项目' && this.info.centralizedPurchasing && this.purchaseAuth) {
        this.purchaseDialog = true
        // 选中已保存的数据
        this.$nextTick(() => {
          const purchaseList = JSON.parse(JSON.stringify(this.purchaseTableData))
          purchaseList.shift()
          const projectIdList = purchaseList.map(val => val.projectId)
          const checkList = projectIdList.map(val => {
            return this.purchaseData.find(item => item.projectId === val)
          })
          this.$refs.multipleTable.clearSelection();
          checkList.map(val => {
            this.$refs.multipleTable.toggleRowSelection(val);
          })
        })
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns && columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data && data.map(item => Number(item[column.property]));
        if (!values?.every(value => isNaN(value))) {
           let total = values?.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return '--';
            }
          }, 0);
          if (total > 1000) { //区别于入账材料数量和入账金额
            total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
          }else {
            total = '--'
          }
          sums[index] = total
          if (sums[index] == 0) { //数据为空时，把0转成--
            sums[index] = '--'
          }
          // sums[index] += ' 元';
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
    moneyFormat(money) {  //千分位带两位小数
      if ((money ?? '') === '') {return ''}
      return Number(money).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    onSubmit(tableData, form) {
      this[tableData].push({
        serialNumber: this.addSerialNum(tableData),
        year: `${this.$moment(this[form].year).format('YYYY')}年`,
        incomeMoney: this[form].money,
        remark: this[form].remark,
        status: '审核中',
        operation: '删除'
      })
      this.increaseDialog = false
      this.paymentDialog = false
    },
    addSerialNum (tableData) {
      if (this[tableData].length < 10) {
        return `0${this[tableData].length}`
      }else {
        return this[tableData].length
      }
    },
    inFunctionality () {
      if (!this.info.isOff) {
        console.log('inFunctionality');
      }
    },
    outFunctionality () {
      if (!this.info.isOff) {
        console.log('outFunctionality');
      }
    },
    pitchOn () {
      this.purchaseTableData = [{
        serialNumber: '添加统一采购项目',
      },...this.tableSelectRow]
      this.purchaseDialog = false
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs.collapse1.settingDefaultShow()
      })
    },
    handleSelectionChange (val) { //被多选框选中的数据行
      console.log(val); 
      this.tableSelectRow = val 
      this.tableSelectRow.sort((a, b) => {
        if (a.serialNumber < b.serialNumber) {
          return -1
        }
        if (a.serialNumber > b.serialNumber) {
          return 1
        }
        return 0
      })
    },
    purchaseRemove (row) {
      if (this.purchaseAuth) {
        const index = this.purchaseTableData.findIndex(val => {
          return val.projectId === row.projectId && val.serialNumber === row.serialNumber
        })
        this.purchaseTableData.splice(index, 1)
      }
    },
    fileDel (file, fileList) {
      const index = fileList.findIndex(val => {
        return val.uid === file.uid
      })
      fileList.splice(index, 1)
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs.collapse2.settingDefaultShow(true)
      })
    },
    download (row) {
      this.$http.download(`/file/downloadFile?id=${row.id}`).then(res => {
        this.$fileDownload(res.data, row.fileName)
      })
    },
    resize () {} 
  },
  components: {timelineForm}
}
</script>

<style lang="less" scoped>
.adminManagementCheck {
  width: 100%;
  height: 100%;
  .header {
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    margin-top: 10px;
    padding-left: 30px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff; 
    span {
      line-height: 26px;
    }
    i {
      font-size: 26px;
    }
  }
  .container {
    flex: 1;
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    .detailsContent {
      padding: 0 10px;
      .projectSetUp, .purchase, .draft, .implementation, .income, .outcome, .comment {
        p {
          display: flex;
          > div {
            flex: 1;
            padding: 0 20px;
            /deep/ .el-select, .el-date-editor {
              width: 100%;
            }
          }
        }
        .uploading {
          button {
            height: 36px;
            padding: 0 20px;
            border: 1px dashed #DCDFE6;
            border-radius: 0;
          }
          .upload-demo {
            margin-bottom: 10px;
          }
          .uploadList {
            margin-top: 10px;
            max-width: 1240px;
            min-height: 40px;
            padding: 10px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            ul li {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              padding: 0 10px;
              margin-bottom: 10px;
              list-style: none;
              background-color: rgba(0, 0, 0, 0.03);
              >span:nth-of-type(1) {
                >span:nth-of-type(1) {
                  display: inline-block;
                  width: 160px;
                  height: 24px;
                  line-height: 24px;
                  font-size: 10px;
                  padding: 0 14px;
                  text-align: center;
                  border-radius: 4px;
                }
              }
              >span:nth-of-type(2) {
                flex: 1;
                margin: 0 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              >span:nth-of-type(3) {
                margin: 0 20px;
              }
              >span:nth-of-type(4) {
                margin-right: 10px;
                font-size: 20px;
                cursor: pointer;
              }
            }
            ul li:nth-last-of-type(1) {
              margin-bottom: 0px;
            }
          }
        }
      }
      .draft p:nth-of-type(1), .income p:nth-of-type(1), .income p:nth-of-type(5), .outcome p:nth-of-type(5){
          span {
            font-size: 20px;
          }
          span:nth-of-type(2) {
            margin: 0 6px;
          }
          span:nth-of-type(3) {
            font-size: 14px;
          }
      }
      .draft, .dashed {
        border-top: 1px dashed rgba(0, 0, 0, 0.2);
        padding-top: 20px;
      }
      .comment {
        .rate {
          div span:nth-of-type(1) {
            display: inline-block;
            width: 100px;
            margin-right: 20px;
          }
          >div >div:nth-last-of-type(1) {
            margin-top: 10px;
          }
        }
      }
      /deep/ .el-upload {
        text-align: left;
      }
      .auditOpinion {
        margin-top: 10px;
      }
      .contractStatus {
        color: orange;
        i {
          margin-right: 10px;
        }
      }
      .btns {
        display: flex;
        justify-content: center;
        padding-bottom: 22px;
        // /deep/ .el-button {
        //   padding: 10px 40px;
        // }
      }
      /deep/ .el-button {
        color: #409EFF;
      }
      /deep/ .el-button--primary {
        color: #fff;
      }
      /deep/ .el-upload--picture-card {
        display: none;
        text-align: center;
        width: 96px;
        height: 96px;
        line-height: 96px;
      }
      /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 96px;
        height: 96px;
      }
      /deep/ .el-dialog__body {
        padding: 0px;
      }
      /deep/ .el-dialog__footer {
        text-align: center;
      }
      /deep/ .el-form-item {  //表单中表格
        overflow: hidden;
      }
      /deep/ .el-table .el-table__cell {
        padding: 0;
      }
      /deep/ .el-table .el-table__body-wrapper td {
        padding: 12px 0;
      }
      .blueTextBtn {
        color: #409EFF; 
        cursor: pointer;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }
  }
  .process {
    margin-top: 10px;
    background-color: #fff;
    min-height: 66px;
    max-height: 250px;
    overflow: auto;
    .statusWrap {
      > span:nth-of-type(2) {
        font-size: 12px;
        height: 34px;
        line-height: 34px;
        padding: 0 30px;
        border-radius: 4px;
      }
    }
  }
}
</style>